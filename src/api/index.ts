import { getDatabase, ref, get, child } from 'firebase/database';
import { getApp } from 'firebase/app';

export class Api {
  static async getTodayCrossword(nowDate: string) {
    const fbApp = getApp();

    const dbRef = ref(getDatabase(fbApp, 'https://hangle-5db1b-default-rtdb.asia-southeast1.firebasedatabase.app'));
    try {
      const snapshot = await get(child(dbRef, `crosswords/${nowDate}`));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available:', nowDate);
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }
}
