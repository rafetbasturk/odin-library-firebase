const uiController = () => {
  const form = document.querySelector(".form")

  return {
    showForm: () => form.style.display = "flex",
    hideForm: () => form.style.display = "none",
    createLibraryList: (books) => {
      let html = ""
      books.forEach(book => {
        html +=
          `<tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.pages}</td>
            <td class="read">
              <div style="${book.isRead === "Read" ? "color: forestgreen" : "color: #C86464"}">${book.isRead}</div>
              <div class="toggle">
                <div data-id=${book.id} class="dot-container">
                  <div data-id=${book.id} style="${book.isRead === "Read" ? "float: right; background: forestgreen" : "float: left; background: #C86464"}" class="dot"></div>
                </div>
                <div>Change Status</div>
              </div>
            </td>
            <td>
              <button data-id=${book.id} class="remove">Remove</button>
              <button data-id=${book.id} class="edit">Edit</button>
            </td>
          <tr/>`
      })
      document.querySelector(".list-item").innerHTML = html
    },
    showAlert: (message, className) => {
      let alert =
        `<div class="alert ${className}">
          ${message}
        </div>`
      form.insertAdjacentHTML("beforebegin", alert)

      setTimeout(() => {
        document.querySelector(".alert").remove();
      }, 1500);
    },
    hideList: () => {
      document.querySelector("table").style.display = "none"
    },
    noBookWarning: () => {
      let html =
        `<div class="empty">
          There is no book on the list.
        </div>`
      document.querySelector(".list-container").insertAdjacentHTML("beforeend", html)
    },
    removeNoBookWarning: () => {
      const element = document.querySelector(".list-container")
      element.childElementCount === 3 ? element.children[2].remove() : null
    },
    showList: () => {
      document.querySelector("table").style.display = "block"
    },
    editState: () => {
      document.querySelector(".list-item").childNodes.forEach(child => {
        child.classList.remove("warning")
      })
      document.querySelector(".submit-add").style.display = "none"
      document.querySelector(".submit-edit").style.display = "block"
    },
    addState: () => {
      document.querySelector(".list-item").childNodes.forEach(child => {
        child.classList.remove("warning")
      })
      document.querySelector(".submit-add").style.display = "block"
      document.querySelector(".submit-edit").style.display = "none"
    }
  }
}

export { uiController }