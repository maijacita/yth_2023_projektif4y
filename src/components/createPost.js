import React, {useState, useEffect} from "react";
import "../styles/FrontPage.css"
import '../styles/PopupMenu.css'
import { getAuth, where, collection, firestore, POSTS, addDoc, USERS, onSnapshot, query, serverTimestamp} from "../Firebase";

const CreatePosts = () => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [school_category, setSchool_category] = useState("");
    const auth = getAuth()
    const [user, setUser] = useState("");

    useEffect(() => {
        const q = query(collection(firestore,USERS), where('uid','==', auth.currentUser.uid)) 
        const queryUserInfo = onSnapshot(q,(querySnapshot) => {
          const tempArray = []
          querySnapshot.forEach((doc) => { // create objects of data
            const usersObject = {
              id: doc.id,
              first_name: doc.data().first_name,
              last_name: doc.data().last_name,
              email: doc.data().email,
              uid: doc.data().uid
            }
            tempArray.push(usersObject) // push object into temporary array
          })
          setUser(tempArray)
        })
        return () => {
            queryUserInfo()
        }
      }, [])


    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (school_category.trim() === "") {
          alert("Please select a category.");

        } else if (title.trim() === "" || body.trim() === "") {
          alert("Title and body are required fields.");

        } else {

            try {
            const timestamp = serverTimestamp();
            const docRef = await addDoc(collection(firestore, POSTS), {
              title: title,
              body: body,
              school_category: school_category,
              timestamp: timestamp,
              poster: user
            });
            console.log("Document written with ID: ", docRef.id);
            setTitle("");
            setBody("");
            setSchool_category("");
          } catch (e) {
            console.error("Error adding document: ", e);
          }
        }
    }

    const handleCategoryChange = (e) => {
      setSchool_category(e.target.value); // Update category state when a new option is selected
  };

    return (
        <div className="postbox">
            <div className="Information">
            <form onSubmit={HandleSubmit}>
                <h3 value={user} onChange={(e) => setUser(e.target.value)}>{user.email}</h3>
                    <div className="txt_field">
                        <input type="title" placeholder="What's the topic title?" value={title} onChange={(e) => setTitle(e.target.value)} required></input>
                            <span></span>
                    </div>
                    <div className="txt_field">
                        <input type="body" placeholder="Write the text..." value={body} onChange={(e) => setBody(e.target.value)} required></input>
                            <span></span>
                    </div>
        <p> Select one from the given options:
		<select id="select1" value={school_category} onChange={handleCategoryChange}>
      <option value="" disabled>Select an option</option>
			<option value="Projects">Projects</option>
			<option value="Courses">Courses</option>
			<option value="Job and internship">Job and internship</option>
            <option value="Event">Event</option>
            <option value="Information">Information</option>
            <option value="Other">Other</option>
		</select>
	</p>  
                    
    <button className="Login_button" type="submit" onClick={HandleSubmit}>Create a post</button>
            </form>
            </div>
        </div>
    )

}

export default CreatePosts