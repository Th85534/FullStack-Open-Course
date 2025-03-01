const Notification = ({ message, type }) => {
    if (message === null) {
      return null;
    }
  
    const notificationStyle = {
      color: type === 'success' ? 'green' : 'red',
      background: 'lightgray',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    };
  
    return <div style={notificationStyle}>{message}</div>;
  };
  
  export default Notification;
  