const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  let finished;
  if (pageCount === readPage) {
    finished = true;
  } else {
    finished = false;
  }
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    id,
    insertedAt,
    updatedAt,
  };
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }else{
  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
}
};
const getAllBooksHandler = (request, h) => {
  const {reading, name, finished} = request.query;
 
  if(name !== undefined){
    const book = books.filter((book) => book.name.toLowerCase().search(name.toLowerCase()) >= 0);
    return {
      status: 'success',
      data: {
        books:book.map((book) =>({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    };
  }
  if(reading !== undefined){
    if (reading == 0) {
      const book = books.filter((book) => book.reading === false);
      return {
        status: 'success',
        data: {
          books:book.map((book) =>({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
    }else if(reading == 1){
      const book = books.filter((book) => book.reading === true);
      return {
        status: 'success',
        data: {
          books:book.map((book) =>({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
    }else{
      const response = h.response({
        status: 'fail',
        message: 'Nilai reading harus 0 atau 1',
      });
      response.code(400);
      return response;
    }
  }
  if(finished !== undefined){
    if (finished == 0) {
      const book = books.filter((book) => book.finished === false);
      return {
        status: 'success',
        data: {
          books:book.map((book) =>({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
    }else if(finished == 1){
      const book = books.filter((book) => book.finished === true);
      return {
        status: 'success',
        data: {
          books:book.map((book) =>({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      };
    }else{
      const response = h.response({
        status: 'fail',
        message: 'Nilai finished harus 0 atau 1',
      });
      response.code(400);
      return response;
    }
  }
  return{
    status: 'success',
    data: {
    books:books.map((book)=>({
       id: book.id,
       name: book.name,
       publisher: book.publisher,
     })),
   },
  }
};
const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((book) => book.id === id)[0];
  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};
const editBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const {  name, year, author, summary, publisher, pageCount, readPage, reading, } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
      response.code(400);
      return response;
    } else if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
      response.code(400);
      return response;
    } else {
    books[index] = {
      ...books[index],
      name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
    }
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};
const deleteBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler  };
