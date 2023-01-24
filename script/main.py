import json
import os
import random

EMPTY_STR = '  '
MIN_WORD_LEN = 3
MAX_WORD_LEN = 6


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
            word = word.replace(' ', '')

            # 빈 문자열은 제외한다.
            if not word:
                return None

            # 시작이나 끝이 온전한 한글이 아니면 제외한다.
            if not (0xAC00 <= ord(word[0]) <= 0xD7A3) or not (0xAC00 <= ord(word[-1]) <= 0xD7A3):
                return None

            if MIN_WORD_LEN <= len(word) <= MAX_WORD_LEN:
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
    # Lemma/feat/val 의 값 길이가 3~6 사이인 것만 추출하여,
    # Sense/feat/att 의 값이 'definition' 인 json 의 Sense/feat/val 값을 가져와서 Lemma/feat/val 와 함께 배열로 javascript 파일로 출력

    # words.js 파일 삭제
    if os.path.exists('script/words.js'):
        os.remove('script/words.js')

    # words.json 파일 삭제
    if os.path.exists('script/words.json'):
        os.remove('script/words.json')

    # words.js 에 export default [ ... ] 를 쓴다.
    with open('script/words.js', 'a', encoding='utf-8') as f:
        f.write('export default [')

    # words.json 에 [{ ... }, { ... }, ...] 를 쓴다.
    with open('script/words.json', 'a', encoding='utf-8') as f:
        f.write('[')

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
                            with open('script/words.js', 'a', encoding='utf-8') as f:
                                word2 = word.replace('\'', '\\\'')
                                definition2 = definition.replace('\'', '\\\'')
                                f.write('{w:\'%s\',d:\'%s\'},' %
                                        (word2, definition2))

                            # words.json 로 출력.
                            with open('script/words.json', 'a', encoding='utf-8') as f:
                                word3 = word.replace('"', '\\"')
                                definition3 = definition.replace('"', '\\"')
                                f.write('{"w":"%s","d":"%s"},' %
                                        (word3, definition3))

    # words.js 에 ] 를 쓴다.
    with open('script/words.js', 'a', encoding='utf-8') as f:
        f.write(']')

    # words.json 에 ] 를 쓴다.
    with open('script/words.json', 'a', encoding='utf-8') as f:
        f.seek(f.tell() - 1, os.SEEK_SET)
        f.truncate()
        f.write(']')


def 우리말샘_추출():
    # 'script/우리말샘_JSON_20230112' 폴더 내의 첫 번째 json 파일을 연 후
    # channel/item 을 json array 로 읽어온 뒤,
    # 각 json 의 wordInfo/word 의 값 길이가 3~6 사이인 것만 추출하여,
    # senseInfo/definition 의 값을 가져와서 wordInfo/word 와 함께 출력
    path = 'script/우리말샘_JSON_20230112'
    files = os.listdir(path)
    for file in files:
        if file.endswith('.json'):
            with open(os.path.join(path, file), 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data['channel']['item']:
                    word = item['wordInfo']['word']
                    if MIN_WORD_LEN <= len(word) <= MAX_WORD_LEN:
                        print(word, ': ', item['senseInfo']['definition'])


def find_column_word(word, start_row, start_col, crossword, dict):
    # 단어 안에서 랜덤으로 글자를 선택한다.
    available_word_index = [i for i in range(len(word))]

    char_index = random.choice(available_word_index)
    char = word[char_index]
    new_start_col = start_col + char_index
    # start_row, new_col 을 기준으로 (-1, -1), (-1, 1), (1, -1), (1, 1) 의 4가지 방향이 빈칸인지 확인한다.
    while (True):
        is_available = True
        if char_index in available_word_index:
            available_word_index.remove(char_index)

        for i in range(-1, 2, 2):
            if start_row + i < 0 or start_row + i >= MAX_WORD_LEN:
                continue

            for j in range(-1, 2, 2):
                if new_start_col + j < 0 or new_start_col + j >= MAX_WORD_LEN:
                    continue

                if crossword[start_row + i][new_start_col + j] != EMPTY_STR:
                    is_available = False
                    break

            if is_available == False:
                break

        if is_available == True or len(available_word_index) == 0:
            break

        char_index = random.choice(available_word_index)
        char = word[char_index]
        new_start_col = start_col + char_index

    if len(available_word_index) == 0:
        return None, None, None

    while (True):
        # 이미 사용한 단어는 삭제한다.
        if word in dict:
            del dict[word]

        if len(dict) == 0:
            # print('사전이 비었다.')
            return None, None, None

        # 글자가 포함된 단어를 찾는다.
        temp_words = [w for w in dict.keys() if char in w]
        available_words = []

        # temp_words 의 각 단어들 중 start_row 에 들어갈 수 있는 것만 available_words 에 넣는다.
        for w in temp_words:
            new_start_row = start_row - w.index(char)
            if new_start_row < 0:
                continue

            # crossword 안에 단어가 들어갈 수 있는지 확인한다.
            if new_start_row + (len(w) - 1) > 5:
                continue

            # crossword 안에 이미 글자가 있는지 확인한다.
            is_available = True
            for i in range(len(w)):
                if start_row == new_start_row + i:
                    continue

                if crossword[new_start_row + i][new_start_col] != EMPTY_STR:
                    is_available = False
                    break

            if is_available == True:
                available_words.append(w)

        # 더이상 사용할 수 있는 단어가 없는 경우
        if len(available_words) == 0:
            # print('사전이 비었다.')
            return None, None, None

        new_word = random.choice(available_words)
        new_start_row = start_row - new_word.index(char)

        # crossword 에 단어를 쓴다.
        for i in range(len(new_word)):
            crossword[new_start_row + i][new_start_col] = new_word[i]

        return new_word, new_start_row, new_start_col


def find_row_word(word, start_row, start_col, crossword, dict):
    # 단어 안에서 랜덤으로 글자를 선택한다.
    available_word_index = [i for i in range(len(word))]

    char_index = random.choice(available_word_index)
    char = word[char_index]
    new_start_row = start_row + char_index
    # new_row, start_col 을 기준으로 (-1, -1), (-1, 1), (1, -1), (1, 1) 의 4가지 방향이 빈칸인지 확인한다.
    while (True):
        is_available = True
        if char_index in available_word_index:
            available_word_index.remove(char_index)

        for i in range(-1, 2, 2):
            if new_start_row + i < 0 or new_start_row + i >= MAX_WORD_LEN:
                continue

            for j in range(-1, 2, 2):
                if start_col + j < 0 or start_col + j >= MAX_WORD_LEN:
                    continue

                if crossword[new_start_row + i][start_col + j] != EMPTY_STR:
                    is_available = False
                    break

            if is_available == False:
                break

        if is_available == True or len(available_word_index) == 0:
            break

        char_index = random.choice(available_word_index)
        char = word[char_index]
        new_start_row = start_row + char_index

    if len(available_word_index) == 0:
        return None, None, None

    while (True):
        # 이미 사용한 단어는 삭제한다.
        if word in dict:
            del dict[word]

        if len(dict) == 0:
            # print('사전이 비었다.')
            return None, None, None

        # 글자가 포함된 단어를 찾는다.
        temp_words = [w for w in dict.keys() if char in w]
        available_words = []

        # temp_words 의 각 단어들 중 start_col 에 들어갈 수 있는 것만 available_words 에 넣는다.
        for w in temp_words:
            new_start_col = start_col - w.index(char)
            if new_start_col < 0:
                continue

            # crossword 안에 단어가 들어갈 수 있는지 확인한다.
            if new_start_col + (len(w) - 1) > 5:
                continue

            # crossword 안에 이미 글자가 있는지 확인한다.
            is_available = True
            for i in range(len(w)):
                if start_col == new_start_col + i:
                    continue

                if crossword[new_start_row][new_start_col + i] != EMPTY_STR:
                    is_available = False
                    break

            if is_available == True:
                available_words.append(w)

        # 더이상 사용할 수 있는 단어가 없는 경우
        if len(available_words) == 0:
            # print('사전이 비었다.')
            return None, None, None

        new_word = random.choice(available_words)
        new_start_col = start_col - new_word.index(char)

        # crossword 에 단어를 쓴다.
        for i in range(len(new_word)):
            crossword[new_start_row][new_start_col + i] = new_word[i]

        return new_word, new_start_row, new_start_col


def make_crossword():
    # words.json 파일을 읽어서 가로 6칸, 세로 6칸 크리의 크로스워드를 만든다.
    # 크로스워드의 단어는 3~6 글자로 구성된 단어이다.
    # 크로스워드의 단어는 words 배열에 있는 단어이다.
    # 크로스워드의 한 행, 한 열에는 단어가 한 번씩만 나타난다.

    # words.json 파일을 읽어서 dict 배열을 만들어 words 에 저장한다. key 는 item['w']이고 value 는 item['d']이다.
    with open('script/words.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        dict = {}
        for item in data:
            dict[item['w']] = item['d']

    # 크로스워드를 만든다.
    correct_words = {}
    # 빈 6x6 crossword 배열을 만든다.
    crossword = []
    for i in range(MAX_WORD_LEN):
        crossword.append([EMPTY_STR] * MAX_WORD_LEN)

    for start_row in range(MAX_WORD_LEN):
        # 임의의 단어 하나를 선택하여 첫 번째 행의 임의의 위치에 넣는다. 그 단어의 정의도 저장한다.
        # definitions 에서 아이템을 임의로 선택한다. key 는 word 이고 value 는 definition 이다.
        word = random.choice(list(dict.keys()))

        row = start_row
        col = random.randint(0, 5 - (len(word) - 1))

        # crossword 안에 이미 글자가 있는지 확인한다.
        is_available = True
        for i in range(len(word)):
            if crossword[row][col + i] != EMPTY_STR:
                is_available = False
                break

        if is_available == False:
            continue

        # 첫 번째 행에 단어를 넣는다.
        for i in range(len(word)):
            crossword[row][col + i] = word[i]
        correct_words[word] = {'row': row, 'col': col,
                               'to': 'row', 'def': dict[word]}

        # 이미 사용한 단어는 삭제한다.
        if word in dict:
            del dict[word]

        # 행에 넣은 단어 중 한 글자를 선택하여 그 글자로 시작하는 단어를 랜덤으로 찾는다.
        # 열에 넣은 단어 중 한 글자를 선택하여 그 글자로 시작하는 단어를 랜덤으로 찾는다.
        # 더이상 넣을 수 없을 때까지 반복한다.
        while (True):
            word, new_row, new_col = find_column_word(
                word, row, col, crossword, dict)
            if word == None:
                break

            row = new_row
            col = new_col
            correct_words[word] = {'row': row, 'col': col,
                                   'to': 'column', 'def': dict[word]}

            word, new_row, new_col = find_row_word(
                word, row, col, crossword, dict)
            if word == None:
                break

            row = new_row
            col = new_col
            correct_words[word] = {'row': row, 'col': col,
                                   'to': 'row', 'def': dict[word]}

    for i in range(len(crossword)):
        print(crossword[i])

    for key, value in correct_words.items():
        print(key, value)


def main():
    # 한국어기초사전_추출()

    for i in range(1):
        make_crossword()


if __name__ == '__main__':
    main()
