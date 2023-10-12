import requestApi from "./api";

export default class CustomUploadAdapter {
    constructor( loader ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
    }

    upload() {
        //upload image to server
        return this.loader.file.then(file => new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('upload', file)
            requestApi('/posts/cke-upload', 'POST', formData, 'json', 'multipart/form-data').then(res => {
                resolve({
                    default: `${process.env.REACT_APP_API_URL}/${res.data.url}`
                })
            }).catch(err => {
                reject(err)
            })
        }))
    }
}