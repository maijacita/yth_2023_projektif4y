import {collection, query, where, USERS, firestore, getDocs} from '../Firebase'

const CheckBlockStatus = async (currentUser) => {
    if (!currentUser) {
        return false;
    }

    const userRef = collection(firestore, USERS);
    const q = query(userRef, where('uid', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    let isBlocked = false;
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.isBlocked) {
            isBlocked = true;
        }
    });

    return isBlocked;
};

export default CheckBlockStatus;