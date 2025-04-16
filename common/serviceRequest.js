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

//Use GET when you're fetching or reading information.
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

//Use POST when you want to create something or trigger a task.
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

//Use PUT when updating resources.
export async function putService(url, data) {
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error("error in putService:" + url, error);
        throw error;
    } finally {
        console.log("finished putService:" + url);
    }
};

//use DELETE when deleting ressources.
export async function delService(url) {
    try {
        const response = await axios.delete(url);
        return response.data;
    } catch (error) {
        console.error("error in delService:" + url, error.data);
        return error.status;
    } finally {
        console.log("finished delService:" + url);
    }
};