import {AsyncStorage, Platform} from "react-native";
import Toast from 'react-native-simple-toast';

// const base_url = "http://localhost:3001/";
const base_url = 'http://localhost:4200';


//http://localhost:4200


// const base_url ="http://192.168.29.7:3001/";

export default {

    toaster(data) {
        //ToastAndroid.show(data, ToastAndroid.SHORT);
        Toast.show(data, Toast.SHORT);

    },


    validatePhonenumber(inputtxt) {
        var phoneno = /^\d{10}$/;
        if (inputtxt.match(phoneno)) {
            return true;
        } else {
            return false;
        }
    },

    async callPostApi(url, data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var postUrl = base_url + url;
        console.log("URL=>" + postUrl + "\n Data=> " + JSON.stringify(data));

        return await fetch(postUrl, {

            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
        })
            .then((response) =>
                response.json()
            )
            .then((res) => {
                if (res) {
                    return {success: res};
                }
            })
            .catch((error) => {
                if (error) {
                    return {err: error};
                }
            });
    },
    async callGetApi(url) {
        let getData="No response";
        try {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");


            var postUrl = base_url + url;

            getData = await fetch(postUrl, {
                method: "GET",
                headers: myHeaders,
                // body:JSON.stringify(data),
            })
                .then((response) =>
                    response.json()
                )
                .then((res) => {
                    if (res) {
                        return {success: res};
                    }
                })
                .catch((error) => {
                    if (error) {
                        return {err: error};
                    }
                });
        }catch (e) {
            e.message;
        }
        return getData;
    },

    async callPutApi(url, data) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var postUrl = base_url + url;

        let getData = await fetch(postUrl, {
            method: "PUT",
            headers: myHeaders,
            body: JSON.stringify(data),
        })
            .then((response) =>
                response.json()
            )
            .then((res) => {
                if (res) {
                    return {success: res};
                }
            })
            .catch((error) => {
                if (error) {
                    return {err: error};
                }
            });
        return getData;
    },

    async getArticleAPI(articleId) {
        //return new Promise((resolve, reject) => {
        let getData = await fetch("https://bloomberg-market-and-financial-news.p.rapidapi.com/stories/detail?internalID=QFY0Y6T0AFB501", {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": "a6150ccbeamshc211cf436207927p106a50jsnaa9f3205ae59",
                "x-rapidapi-host": "bloomberg-market-and-financial-news.p.rapidapi.com"
            }
        })
            .then((response) =>
                response.json()
            )
            .then((res) => {
                if (res) {
                    return {success: res};
                }
            })
            .catch(err => {
                console.error(err);
            });
        //})
//TODO:something weird is happening here, there is a service in the backend that does the same thing
        return getData;
    },

    async serUserId(userId) {
        console.log("setting user id " + userId);
        return await AsyncStorage.setItem("LOGGEDUSERID", userId); // "5fa1ae1e18eb755e3ee8dbb6";
    },

    async getUserId() {
        return await AsyncStorage.getItem("LOGGEDUSERID"); // "5fa1ae1e18eb755e3ee8dbb6";
    },

    getInviteCSS() {
        return Platform.OS === 'ios' ? {
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: 'center',
            color: "D9397F",
            fontFamily: "NunitoSans-Regular",
        } : {
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            color: "#D9397F",
            fontSize: 18,
            lineHeight: 65,
            fontFamily: "NunitoSans-Regular",
            marginTop: 0
        }
    },

    getInputViewCSS() {
        return Platform.OS === 'ios' ? {
            marginVertical: 5,
            borderBottomWidth: 1,
            flexDirection: "row",
            borderColor: "gray",
            alignItems: "center",
            marginTop: 10,
            marginBottom: 20
        } : {
            marginVertical: 5,
            borderBottomWidth: 1,
            flexDirection: "row",
            borderColor: "gray",
            alignItems: "center",
        }
    }
};
