import fetch from "node-fetch"

interface Params{
  url: string
}

// for http api
const request = {
  post: function ({url, params = {}}) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: "POST",
        headers: {
          "Accept": "*/*",
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify(params)
      }).then(res => {
        return res.json()
      }).then(data => {
        resolve(data);
      }).catch(error => {
        console.log(error.msg)
        reject(error)
      })
    })

  }
}

export default request;


