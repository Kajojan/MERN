import React from "react";

function CommentsList({ comments }) {
  return (
    <div>
      <ul>
        
        {comments.map((ele, index) => {
          return (
            <li key={index}>
             <a> emial: {ele.email} </a>
              <a>name:  {ele.name}</a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default CommentsList;
