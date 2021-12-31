// Book Class : represents a book
class Book{
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class : handles UI Tasks
class UI {
    static displayBooks(){
        // const storageBook = [
        //     {
        //         title : 'Book One',
        //         author : 'Jonh Doe',
        //         isbn : 16253495 
        //     },
        //     {
        //         title : 'Book Two',
        //         author : 'Jane Doe',
        //         isbn : 15426367 
        //     }
        // ]

        // const books = storageBook;
        const books = Store.getBooks();
        books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td>
          <button class='btn btn-danger btn-sm delete'>X</button>
        </td>
        `;
        // <!--<i class="fa fa-trash" aria-hidden="true"></i>-->
        list.appendChild(row)
    }

    static deleteBook(target){
        const list = document.querySelector('#book-list');
        if(target.classList.contains('delete')){
            // target.parentElement.parentElement.remove();
            list.removeChild(target.parentElement.parentElement);
        }
    }

    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        // Finishing in 3 seconds
        setTimeout(()=> document.querySelector('.alert').remove(), 3000);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

}
// Store Class: handles storage tasks
class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index)=>{
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        })

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event : Display Book
document.addEventListener('DOMContentLoad', UI.displayBooks());

// Event : add a book
document.querySelector('#book-form').addEventListener('submit', (e)=>{
    // Prevent default action
    e.preventDefault();

    // Get form value
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill all fields!', 'danger');
    }else{
        // Create a Book  object
        const book = new Book(title, author, isbn);

        // add Book to the list
        UI.addBookToList(book);

        // show success message
        UI.showAlert('Book Added', 'success');

        // add Book to localStorage
        Store.addBook(book);


        // reset form fields
        UI.clearFields();
    }

    
});
// Event : remove a book
document.querySelector('#book-list').addEventListener('click', (e)=>{
    // Remove book from UI
    UI.deleteBook(e.target);

    // Remove book from localStorage
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

     // show success message
     UI.showAlert('Book Removed', 'success');
});