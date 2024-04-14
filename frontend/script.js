document.addEventListener('DOMContentLoaded', () => {
  fetchBooks();
  document.getElementById('close-popup').addEventListener('click', () => {
      document.getElementById('author-details-popup').style.display = 'none';
  });
  document.getElementById('add-book-btn').addEventListener('click', addBook);
});

async function fetchBooks() {
  try {
      const response = await fetch('/api/Biblioteca');
      const books = await response.json();
      const booksContainer = document.getElementById('books-container');
      booksContainer.innerHTML = generateBooksHTML(books);
      addAuthorLinksEventListeners();
  } catch (error) {
      console.error('Error fetching books:', error);
  }
}

async function addBook() {
  try {
      const response = await fetch('/api/Biblioteca');
      const books = await response.json();
      const maxId = books.reduce((max, book) => (book.id > max ? book.id : max), 0);
      const newId = maxId + 1;

      const titlu = document.getElementById('add-titlu').value;
      const numeAutor = document.getElementById('add-nume-autor').value;
      const nationalitateAutor = document.getElementById('add-nationalitate-autor').value;
      const dataNasteriiAutor = document.getElementById('add-data-nasterii-autor').value;
      const opereImportanteAutor = document.getElementById('add-opere-importante-autor').value.split(',');
      const pagini = document.getElementById('add-pagini').value;
      const pret = document.getElementById('add-pret').value;
      const genuri = document.getElementById('add-genuri').value.split(',');
      const titluRecenzie = document.getElementById('add-titlu-recenzie').value;
      const descriereRecenzie = document.getElementById('add-descriere-recenzie').value;
      const responsePost = await fetch('/api/Biblioteca', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              id: newId,
              titlu,
              autor: {
                  nume: numeAutor,
                  nationalitate: nationalitateAutor,
                  data_nasterii: dataNasteriiAutor,
                  opere_importante: opereImportanteAutor
              },
              pagini,
              pret,
              genuri,
              recenzie: {
                  titlu: titluRecenzie,
                  descriere: descriereRecenzie
              }
          })
      });

      if (responsePost.ok) {
          fetchBooks();
          alert('Cartea a fost adăugată cu succes!');
      } else {
          alert('Eroare la adăugarea cărții!');
      }
  } catch (error) {
      console.error('Error adding book:', error);
      alert('Eroare la adăugarea cărții!');
  }
}


async function updateBook() {
    try {
      const id = document.getElementById('update-id').value;
      const titlu = document.getElementById('update-titlu').value;
      const numeAutor = document.getElementById('update-nume-autor').value;
      const nationalitateAutor = document.getElementById('update-nationalitate-autor').value;
      const dataNasteriiAutor = document.getElementById('update-data-nasterii-autor').value;
      const opereImportanteAutor = document.getElementById('update-opere-importante-autor').value.split(',');
      const pagini = document.getElementById('update-pagini').value;
      const pret = document.getElementById('update-pret').value;
      const genuri = document.getElementById('update-genuri').value.split(',');
      const titluRecenzie = document.getElementById('update-titlu-recenzie').value;
      const descriereRecenzie = document.getElementById('update-descriere-recenzie').value;
  
      const response = await fetch(`/api/Biblioteca/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titlu,
          autor: {
            nume: numeAutor,
            nationalitate: nationalitateAutor,
            data_nasterii: dataNasteriiAutor,
            opere_importante: opereImportanteAutor
          },
          pagini,
          pret,
          genuri,
          recenzie: {
            titlu: titluRecenzie,
            descriere: descriereRecenzie
          }
        })
      });
  
      if (response.ok) {
        fetchBooks();
        alert('Cartea a fost actualizată cu succes!');
      } else {
        alert('Eroare la actualizarea cărții!');
      }
    } catch (error) {
      console.error('Eroare actualizare carte:', error);
      alert('Eroare la actualizarea cărții!');
    }
  }
  

async function deleteBook() {
    try {
      const id = document.getElementById('delete-id').value;
  
      const response = await fetch(`/api/Biblioteca/${id}`, {
        method: 'DELETE'
      });
  
      if (response.ok) {
        fetchBooks();
        alert('Cartea a fost ștearsă cu succes!');
      } else {
        const errorMessage = await response.json();
        alert(errorMessage.error || 'Eroare la ștergerea cărții!');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Eroare la ștergerea cărții!');
    }
  }
  


function generateBooksHTML(books) {
  let html = '<table>';
  html += '<tr><th>ID</th><th>Titlu</th><th>Autor</th><th>Pagini</th><th>Pret</th><th>Genuri</th><th>Recenzie</th></tr>';
  books.forEach(book => {
      html += `<tr>
                  <td>${book.id}</td>
                  <td>${book.titlu}</td>
                  <td><a href="#" class="author-link" data-author='${JSON.stringify(book.autor)}'>${book.autor.nume}</a></td>
                  <td>${book.pagini}</td>
                  <td>${book.pret}</td>
                  <td>${book.genuri.join(', ')}</td>
                  <td>${book.recenzie ? `${book.recenzie.titlu}: ${book.recenzie.descriere}` : ''}</td>
              </tr>`;
  });
  html += '</table>';
  return html;
}

function addAuthorLinksEventListeners() {
  const authorLinks = document.querySelectorAll('.author-link');
  authorLinks.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();
          const authorData = JSON.parse(this.getAttribute('data-author'));
          const authorDetailsDiv = document.getElementById('author-details');
          authorDetailsDiv.innerHTML = `
              <p><strong>Nume:</strong> ${authorData.nume}</p>
              <p><strong>Nationalitate:</strong> ${authorData.nationalitate}</p>
              <p><strong>Data nasterii:</strong> ${authorData.data_nasterii}</p>
              <p><strong>Opere importante:</strong> ${authorData.opere_importante.join(', ')}</p>
          `;
          document.getElementById('author-details-popup').style.display = 'block';
      });
  });
}
