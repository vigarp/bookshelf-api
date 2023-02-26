const { nanoid } = require("nanoid");
const books = require("./books");
const { handleSearch } = require("./utils");

const addBookHandler = (req, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal menambahkan buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (Number(readPage) > Number(pageCount)) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished: pageCount === readPage ? true : false,
    reading: reading === false ? false : true,
    insertedAt,
    updatedAt,
  };
  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
};

const getAllBooksHandler = (req, h) => {
  const str = req.query.name;
  const reading = req.query.reading;
  const finished = req.query.finished;

  if (str) {
    let results = handleSearch(books, str);
    const response = h.response({
      status: "success",
      data: {
        books: results.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (reading === "0") {
    const results = books.filter((book) => book.reading === false);
    const response = h.response({
      status: "success",
      data: {
        books: results.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (reading === "1") {
    const results = books.filter((book) => book.reading === true);
    const response = h.response({
      status: "success",
      data: {
        books: results.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (finished === "0") {
    const results = books.filter((book) => book.finished === false);
    const response = h.response({
      status: "success",
      data: {
        books: results.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else if (finished === "1") {
    const results = books.filter((book) => book.finished === true);
    const response = h.response({
      status: "success",
      data: {
        books: results.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  } else {
    const response = h.response({
      status: "success",
      data: {
        books: books.map(({ id, name, publisher }) => ({
          id,
          name,
          publisher,
        })),
      },
    });
    response.code(200);
    return response;
  }
};

const getBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: "success",
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: "fail",
    message: "Buku tidak ditemukan",
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = req.payload;

  const index = books.findIndex((book) => book.id === id);

  if (!name) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  } else if (Number(readPage) > Number(pageCount)) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }

  const updateAt = new Date().toISOString();

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished: pageCount === readPage ? true : false,
      reading: reading === false ? false : true,
      updateAt,
    };

    const response = h.response({
      status: "success",
      message: "Buku berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Gagal memperbarui buku. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
