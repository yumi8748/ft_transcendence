import axios from 'axios';

//axios.get(url)
//    .then(function (response) {
//        //success
//        console.log("getService Success");
//        console.log(response.data);
//    })
//    .catch(function (error) {
//        //error
//        console.log(error);
//    })
//    .finally(function () {
//        console.log("finished getService");
//    })

export async function getService(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("error in getService:" + url, error.data);
        return error.status;
    } finally {
        console.log("finished getService:" + url);
    }
};

export async function postService(url, data) {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("error in postService:" + url, error);
        throw error;
    } finally {
        console.log("finished postService:" + url);
    }
};
