const Notification = ({ msg, type='success' }) => {
  const notificationStyle = {
    color: type==='error'? 'red' : 'green',
    backgroundColor: 'lightgrey',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontStyle: 'italic',
    fontSize: 16
  }

  if (msg === null) {
    return null
  }

  return (
    <div className="notification" style={notificationStyle}>
      {msg}
    </div>
  )
}

export default Notification