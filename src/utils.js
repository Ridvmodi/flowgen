import axios from "axios"

const baseUrl = "http://localhost:5000/"

export const getJsonData = ()=>{
    axios.get(`${baseUrl}/`)
}

export const uploadFile = async(file)=>{
    const resp = await axios.post(`${baseUrl}/upload`,file);
    return resp.data;
}

export const getStatus = async(fileId)=>{
    const resp = await axios.get(`${baseUrl}/status/${fileId}`);
    return resp.data;
}

export const updateCsv = async(payload)=>{
    const resp = await axios.post(`${baseUrl}/upadte`,payload);
    return resp.data;
}