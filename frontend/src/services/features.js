import axios from "axios"

const baseUrl = '/api/features'

const getFeatures = async ({ filter = '' }) => {
  const request = await axios.get(baseUrl.concat(filter))
  return request.data
}

const addComment = async ({ feat_id, body }) => {
  const request = await axios.post(`${baseUrl}/${feat_id}/comments`, body)
  return request
}

export default { getFeatures, addComment }