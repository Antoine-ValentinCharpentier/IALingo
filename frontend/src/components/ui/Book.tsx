import React from "react";

import "../../assets/styles/components/ui/Book.css";

type BookProps = {};

const Book: React.FC<BookProps> = () => {
  return (
    <div className="book">
        <div className="book-cover">
            <div className="book-skin">IALingo</div>
        </div>
        <div className="book-page"></div>
    </div>
  );
};

export default Book;
