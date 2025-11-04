export const Images = {
    logo : require('../assets/user1.png'),
    male : require('../assets/male.png'),
    female : require('../assets/female.png'),
    other : require('../assets/lgbt.png'),
    coin : require('../assets/leaf.png')
}

export const getUserImage = (user:"male"|"female"|"other") => {
    if(user=="male") return Images.male
    else if(user=="female") return Images.female
    else if(user=="other") return Images.other
    else return Images.logo
}