import { useState } from "react"

const CommentForm = ({ feat_id, sendComment}) => {
  const [viewComment, setViewComment] = useState(false)
  const [comment, setComment] = useState('')

  const hideComment = {display: viewComment ? 'none' : ''}
  const showComment = {display: viewComment ? '' : 'none'}

  const handleComment = () => setViewComment(!viewComment)

  const addComment = (event) => {
    event.preventDefault()
    console.log(comment)
    const body = { body: comment}
    console.log(body)
    sendComment({ feat_id, body })
    setComment('')
    handleComment()
  }

  return (
    <div className="commentForm">
      <div style={hideComment}>
        <button onClick={handleComment}>Add Comment</button>
      </div>
      <div style={showComment}>
        <form onSubmit={addComment}>
          <textarea 
            style={{resize: 'none'}}
            name="comment"
            value={comment}
            placeholder="Write a comment..."
            cols='50'
            rows='5'
            onChange={({target}) => setComment(target.value)} 
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default CommentForm