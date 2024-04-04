const FlashMessage = ({type, header, body, withDelete}, props) => {
  const typeClassMap = {
    success: 'is-success',
  };

  return (
    <article className={`message ${typeClassMap[type]}`}>
      <div className="message-header">
        <p>{header}</p>
        {withDelete &&
         <button className="delete" aria-label="delete"></button>
        }
      </div>
      <div className="message-body">{body}</div>
    </article>
  );
};

export default FlashMessage;
