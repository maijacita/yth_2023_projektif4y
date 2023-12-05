import {collection, query, where, USERS, firestore, getDocs} from '../Firebase'

const checkAdminStatus = async (currentUser) => {
    if (!currentUser) {
        return false;
    }

    const userRef = collection(firestore, USERS);
    const q = query(userRef, where('uid', '==', currentUser.uid));
    const querySnapshot = await getDocs(q);

    let isAdmin = false;
    querySnapshot.forEach((doc) => {
        const userData = doc.data();
        if (userData.isAdmin && userData.roles && userData.roles.includes('admin')) {
            isAdmin = true;
        }
    });

    return isAdmin;
};

export default checkAdminStatus;
