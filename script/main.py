import json
import os


def extractLemma(lemma):
    # lemma 가 dict 인 경우
    if isinstance(lemma, dict):
        lemma_feat = lemma['feat']
        if lemma_feat['att'] == 'writtenForm':
            word = lemma_feat['val']
            # 단어에서 '(숫자)' 를 제거한다.
            word = word.split('(')[0]

            # 시작이나 끝이 '-' 이면 제외한다.
            if word.startswith('-') or word.endswith('-'):
                return None

            word = word.replace('-', '')

            # 빈 문자열은 제외한다.
            if not word:
                return None

            # 시작이나 끝이 온전한 한글이 아니면 제외한다.
            if not (0xAC00 <= ord(word[0]) <= 0xD7A3) or not (0xAC00 <= ord(word[-1]) <= 0xD7A3):
                return None

            if 2 <= len(word) <= 6:
                return word
    # lemma 가 list 인 경우
    elif isinstance(lemma, list):
        for lemma in lemma:
            word = extractLemma(lemma)
            if word:
                return word


def extractSenseFeat(sense_feat):
    # sense_feat 가 dict 인 경우
    if isinstance(sense_feat, dict):
        if sense_feat['att'] == 'definition':
            return sense_feat['val']
    # sense_feat 가 list 인 경우
    elif isinstance(sense_feat, list):
        for sense_feat in sense_feat:
            definition = extractSenseFeat(sense_feat)
            if definition:
                return definition


def extractSense(sense):
    # sense 가 dict 인 경우
    if isinstance(sense, dict):
        sense_feat = sense['feat']
        definition = extractSenseFeat(sense_feat)
        if definition:
            return definition
    # sense 가 list 인 경우
    elif isinstance(sense, list):
        for sense in sense:
            definition = extractSense(sense)
            if definition:
                return definition


def 한국어기초사전_추출():
    # 'script/한국어기초사전_JSON_20230112' 폴더 내의 첫 번째 json 파일을 연 후
    # LexicalResource/Lexicon/LexicalEntry 을 json array 로 읽어온 뒤,
    # 각 json 의 Lemma/feat/att 의 값이 'writtenForm' 이고,
    # Lemma/feat/val 의 값 길이가 2~6 사이인 것만 추출하여,
    # Sense/feat/att 의 값이 'definition' 인 json 의 Sense/feat/val 값을 가져와서 Lemma/feat/val 와 함께 배열로 javascript 파일로 출력

    # words.js 파일 삭제
    if os.path.exists('script/words.js'):
        os.remove('script/words.js')

    # words.js 에 export default [ ... ] 를 쓴다.
    with open('script/words.js', 'a', encoding='utf-8') as f:
        f.write('export default [')

    path = 'script/한국어기초사전_JSON_20230112'
    files = os.listdir(path)
    for file in files:
        if file.endswith('.json'):
            with open(os.path.join(path, file), 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data['LexicalResource']['Lexicon']['LexicalEntry']:
                    word = extractLemma(item['Lemma'])
                    if word:
                        definition = extractSense(item['Sense'])
                        if definition:
                            # words.js 로 출력.
                            word = word.replace('\'', '\\\'')
                            definition = definition.replace('\'', '\\\'')
                            with open('script/words.js', 'a', encoding='utf-8') as f:
                                f.write('{w: \'%s\', d: \'%s\'},' %
                                        (word, definition))

    # words.js 에 ] 를 쓴다.
    with open('script/words.js', 'a', encoding='utf-8') as f:
        f.write(']')


def 우리말샘_추출():
    # 'script/우리말샘_JSON_20230112' 폴더 내의 첫 번째 json 파일을 연 후
    # channel/item 을 json array 로 읽어온 뒤,
    # 각 json 의 wordInfo/word 의 값 길이가 2~6 사이인 것만 추출하여,
    # senseInfo/definition 의 값을 가져와서 wordInfo/word 와 함께 출력
    path = 'script/우리말샘_JSON_20230112'
    files = os.listdir(path)
    for file in files:
        if file.endswith('.json'):
            with open(os.path.join(path, file), 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data['channel']['item']:
                    word = item['wordInfo']['word']
                    if 2 <= len(word) <= 6:
                        print(word, ': ', item['senseInfo']['definition'])


def main():
    한국어기초사전_추출()
    # 우리말샘_추출()


if __name__ == '__main__':
    main()