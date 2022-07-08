import { initializeApp } from "firebase/app";
import {
  getFirestore, collection,
  addDoc, deleteDoc, doc,
  onSnapshot,
  query, orderBy, serverTimestamp,
  getDoc, updateDoc
} from "firebase/firestore";
import { uiController } from "./ui";

const ui = uiController()

const firebaseConfig = {
  apiKey: "AIzaSyDMhsqm2wgk8c-xAX0dF4Wl9P2zqAcIXt4",
  authDomain: "library-rafet.firebaseapp.com",
  projectId: "library-rafet",
  storageBucket: "library-rafet.appspot.com",
  messagingSenderId: "249069491038",
  appId: "1:249069491038:web:17ae53b64d8718b5a9f5cf"
};

initializeApp(firebaseConfig);
const db = getFirestore()
const colRef = collection(db, "books")

// sort db
const q = query(colRef, orderBy("createdAt", "desc"))

// get realtime data from the db
onSnapshot(q, (snapshot) => {
  let books = []
  snapshot.docs.forEach(doc => {
    books = [...books, { ...doc.data(), id: doc.id }]
  })
  if (books.length !== 0) {
    ui.removeNoBookWarning()
    ui.showList()
    ui.createLibraryList(books)
  }
  else {
    ui.noBookWarning()
    ui.hideList()
  }
})

// select elements
const form = document.querySelector(".form")
const showForm = document.querySelector(".open-form")
const hideForm = document.querySelector(".close-form")
const addBtn = document.querySelector(".submit-add")
const editBtn = document.querySelector(".submit-edit")
const table = document.querySelector("table")

// show and hide form
showForm.addEventListener("click", ui.showForm)
hideForm.addEventListener("click", () => {
  ui.hideForm()
  form.reset()
  ui.addState()
})

// add a new book to the database
addBtn.addEventListener("click", e => {
  e.preventDefault()
  if (form.title.value !== "" && form.author.value !== "") {
    addDoc(colRef, {
      title: form.title.value,
      author: form.author.value,
      pages: form.pages.value,
      isRead: form.read.value,
      createdAt: serverTimestamp()
    })
      .then(() => {
        form.reset()
        ui.hideForm()
        ui.showAlert("Saved to database", "success")
      })
  }
  else {
    ui.showAlert("Title and Author should be declared!", "warning")
  }
})

// submit edited book
editBtn.addEventListener("click", e => {
  e.preventDefault()
  const docRef = doc(db, "books", e.target.dataset.id)
  getDoc(docRef).then(doc => {
    const { title, author, pages, isRead } = doc.data()
    if (title !== form.title.value || author !== form.author.value || pages !==form.pages.value || isRead !== form.read.value) {
      updateDoc(docRef, {
        title: form.title.value,
        author: form.author.value,
        pages: form.pages.value,
        isRead: form.read.value,
      })
        .then(() => {
          form.reset()
          ui.hideForm()
          ui.addState()
          ui.showAlert("Book is edited", "success")
          showForm.textContent = "NEW BOOK"
        })
    }
    else {
      ui.showAlert("There is no change!", "warning")
    }
  })
})

// event listener for the table
table.addEventListener("click", e => {
  // remove the selected book from db
  if (e.target.className === "remove") {
    removeBook(e.target.dataset.id);
  }
  // set edit mode
  else if (e.target.className === "edit") {
    ui.showForm()
    ui.editState()
    e.target.parentNode.parentNode.classList.add("warning")
    const docRef = doc(db, "books", e.target.dataset.id)
    getDoc(docRef).then(doc => {
      const { title, author, pages, isRead } = doc.data()
      form.title.value = title
      form.author.value = author
      form.pages.value = pages
      form.read.value = isRead
      document.querySelector(".submit-edit").setAttribute("data-id", doc.id)
    })
  }
  // toggle red status
  else if (e.target.classList.contains("dot") || e.target.classList.contains("dot-container")) {
    const docRef = doc(db, "books", e.target.dataset.id)
    getDoc(docRef).then(doc => {
      const { isRead } = doc.data()
      if (isRead === "Read") {
        updateDoc(docRef, { isRead: "Not read" })
      }
      else {
        updateDoc(docRef, { isRead: "Read" })
      }
    })
  }
})

// remove selected book from the database
const removeBook = (id) => {
  const docRef = doc(db, "books", id)
  deleteDoc(docRef).then(() => {
    ui.showAlert("Book deleted from the database", "danger")
  })
}