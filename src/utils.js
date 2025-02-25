import axios from "axios"

const baseUrl = "https://4a2a-49-207-234-219.ngrok-free.app/"

const ng = "?ngrok-skip-browser-warning=true"


const hardcodedResponse = {
    uploadFile : {
        "file_id": "1740120964",
        "message": "File uploaded successfully. Processing started."
    },
        "status": {
            "chunks_processed": "0/4",
            "csv_url": "https://uniquest-demo.s3.amazonaws.com/grc_files/1740120964/grc_data_1740120964.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU2VPE6VL5RUFDLTV%2F20250221%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250221T065615Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=1c7de8964aaf0d7a71748367b29869f4a230cbe00e799f901912de590e22af75",
            "json_url": "https://uniquest-demo.s3.amazonaws.com/grc_files/1740120964/grc_data_1740120964.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU2VPE6VL5RUFDLTV%2F20250221%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250221T065615Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=def4845cb4607605fbba60c00609618bade11fe3db668209df85ecdab5479c46",
            "status": "Completed",
    "version": 1
        },
    update : {
        "csv_url": "https://uniquest-demo.s3.amazonaws.com/grc_files/1740123734/updated_2_1740123734.csv?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU2VPE6VL5RUFDLTV%2F20250221%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250221T074232Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=da0cad90a9a0d1e8ede7f189d846628cf357934911bb0439074db31df119243c",
        "json_url": "https://uniquest-demo.s3.amazonaws.com/grc_files/1740123734/updated_2_1740123734.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAU2VPE6VL5RUFDLTV%2F20250221%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250221T074232Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=4b282d4bd78825a5c8a3fc41ad9d6746cacb85c619bf2c429b06c10cbcdd1bfd",
        "message": "Update successful",
        "version": 2
    }
}


const hedervalue = {
    headers: {"ngrok-skip-browser-warning": true}
}

export const getJsonData = ()=>{
    axios.get(`${baseUrl}/`)
}

export const uploadFile = async (file) => {
    const resp = await axios.post(`${baseUrl}upload${ng}`, file, hedervalue);
    return resp.data;
};

export const getStatus = async(fileId)=>{
    const resp = await axios.get(`${baseUrl}status/${fileId}`,hedervalue);
    return resp.data
    // return hardcodedResponse.status;
}

export const updateCsv = async(payload)=>{
    const resp = await axios.post(`${baseUrl}update${ng}`,payload,hedervalue);
    return resp.data
    // return hardcodedResponse.update;
}

export const fetchJsonData = async(obj) => {
    if (!obj.json_url) {
      throw new Error("json_url is missing in the object");
    }
    try {
      const response = await fetch(obj.json_url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching JSON data:", error);
      throw error;
    }
  }