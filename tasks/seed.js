const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const users = data.users;
const arts = data.artItem;

async function main() {
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();
    
    console.log("hello?");
    const user1 = await users.createUser(
        "csnerd101", 
        "password", 
        "Computer", 
        "Science",
        "csnerd101@gmail.com",
        "2001-01-01"
    );
    const user2 = await users.createUser(
        "csnerd102", 
        "password", 
        "Bob", 
        "Stanly",
        "bstanly@gmail.com",
        "2001-05-01"
    );
    const user3 = await users.createUser(
        "csnerd103", 
        "password", 
        "Rick", 
        "Sanchez",
        "rsanchez@gmail.com",
        "1960-05-01"
    );
    console.log("user1Id:",user1._id);
    try {
        const art1 = await arts.createArtItem(
            user1.userID.toString(),
            "Mona Lisa",
            "The really expensive art piece that I did not plagarize",
            false,
            1,
            3.5,
            "famous", 
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/1200px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
            [],
            "lisa"
        );
    } catch (e){
        console.log(e)
    }
    
    try {
        const art2 = await arts.createArtItem(
            user1.userID.toString(),
            "An Avacado.... thankkkss",
            "iykyk",
            true,
            1,
            5,
            "meme",
            "https://i.insider.com/55df431add08956e408b4611?width=536&format=jpeg",
            [],
            "avacado"
        );
    
    } catch (e) {
        console.log(e)
    }
    try {
        const art3 = await arts.createArtItem(
            user1.userID.toString(),
            "Just a regular Cat.",
            "Random Picture 3",
            false,
            1,
            4,
            "cat", 
            "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/481px-Cat03.jpg",
            [],
            "cat"
        );
    } catch (e) {
        console.log(e)
    }
    try {     
    const art4 = await arts.createArtItem(
        user2.userID.toString(),
        "Pineapple.",
        "Random Picture 3",
        true,
        1,
        3,
        "modern art",
        "https://images.unsplash.com/photo-1481349518771-20055b2a7b24?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tfGVufDB8fDB8fA%3D%3D&w=1000&q=80",
        [],
        "Pineapple"
    );
    } catch (e) {
        console.log(e)
    }
    
 
    console.log('Done seeding database');
    dbConnection.closeConnection();
}
  
main();