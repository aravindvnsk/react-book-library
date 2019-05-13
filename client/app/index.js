import React from 'react';
import { render } from 'react-dom';

import { Header } from "./components/Header";
import '../assets/css/main.scss';
import axios from 'axios'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      addNewBook: false,
      modal: {
        Author: '',
        Title: '',
        Description: '',
        id: ''
      },
      newBook: {
        Author: '',
        Title: '',
        Description: '',
        id: ''
      }
    };
  }

  componentDidMount() {
    this.getAllBooks();
  }

  getAllBooks = () => {
    axios.get('http://localhost:3000/books')
      .then(res => {
        this.setState({
          tableData: this.prepareDataForReactTable(res.data),
        });
      });
  }

  addNewBook = () => {
    let url = "http://localhost:3000/books/";
    let header = {
      'Content-Type': 'application/json',
    };
    let body = {
      "id": this.createIdForNewBook(),
      "title": this.state.newBook.Title,
      "author": this.state.newBook.Author,
      "description": this.state.newBook.Description,
    }
    axios.post(url, body, { headers: header })
      .then(res => {
        this.setState({ addNewBook: false });
        this.getAllBooks();
      });

  }

  editABook = (e) => {
    let url = "http://localhost:3000/books/" + this.state.modal.id;
    let header = {
      'Content-Type': 'application/json',
    };
    let body = {
      "id": this.state.modal.id,
      "title": this.state.modal.Title,
      "author": this.state.modal.Author,
      "description": this.state.modal.Description,
    }
    axios.put(url, body, { headers: header })
      .then(res => {
        this.getAllBooks();
      });
  }

  deleteABook = (e) => {
    let url = "http://localhost:3000/books/" + e.target.id;
    axios.delete(url)
      .then(res => {
        this.getAllBooks();
      });
  }

  reactTableFilter = (filter, row, column) => {
    const id = filter.pivotId || filter.id
    return row[id] !== undefined ? ((String(row[id].toLowerCase()).startsWith(filter.value.toLowerCase())) || (String(row[id].toLowerCase()).includes(filter.value.toLowerCase()))) : true
  }

  enableInputForAddNewBook = () => {
    this.setState({ addNewBook: true });
  }

  createIdForNewBook = () => {
    let arr = [];
    this.state.tableData.map(item => arr.push(item.id));
    return (Math.max(...arr) + 1);
  }

  showBookEditModal = (e) => {
    this.state.tableData.map(item => {
      if (item.id == e.target.id) {
        this.setState({
          modal: {
            ...this.state.modal,
            Author: item.author,
            Title: item.title,
            Description: item.description,
            id: e.target.id
          }
        });
      }
    });
    document.getElementById("favDialog").showModal();
  }

  updateBookDetails = (e) => {
    switch (e.target.id) {
      case "modalTitle":
        this.setState({ modal: { ...this.state.modal, Title: e.target.value } });
        break;
      case "modalAuthor":
        this.setState({ modal: { ...this.state.modal, Author: e.target.value } });
        break;
      case "modalDescription":
        this.setState({ modal: { ...this.state.modal, Description: e.target.value } });
        break;
      case "newTitle":
        this.setState({ newBook: { ...this.state.newBook, Title: e.target.value } });
        break;
      case "newAuthor":
        this.setState({ newBook: { ...this.state.newBook, Author: e.target.value } });
        break;
      case "newDescription":
        this.setState({ newBook: { ...this.state.newBook, Description: e.target.value } });
        break;
    }
  }

  prepareDataForReactTable = (res) => {
    let data = [];
    res.map(item => {
      let arr = [];
      arr.num = data.length + 1,
        arr.title = item.title,
        arr.author = item.author,
        arr.id = item.id,
        arr.icons = (<span>
          <button className='btn btn-primary' id={item.id} onClick={this.showBookEditModal}>Edit</button>
          <button className='btn btn-primary' id={item.id} onClick={this.deleteABook} style={{ position: 'relative', left: '10px' }}>Delete</button>
        </span>),
        arr.description = item.description
      data.push(arr);
    });
    return data;
  }



  render() {
    const columns = [{
      Header: 'S.No',
      accessor: 'num'
    }, {
      Header: 'Title',
      accessor: 'title',
      filterable: true,
    }, {
      accessor: 'author',
      Header: 'Author',
      filterable: true
    }, {
      accessor: 'description',
      Header: 'Description',
      filterable: true
    }, {
      accessor: 'icons',
      Header: 'Action Icons',
      sortable: false
    }];

    const enableAddNewBtn = (this.state.newBook.Title.length > 0 && this.state.newBook.Description.length > 0 && this.state.newBook.Author.length > 0);
    const enableUpdateBtn = (this.state.modal.Title.length > 0 && this.state.modal.Description.length > 0 && this.state.modal.Author.length > 0);

    const addANewBook = (
      <div>
        <label className="modalLabel">Author</label>
        <input id="newAuthor" value={this.state.newBook.Author} onChange={this.updateBookDetails} ></input>
        <label className="modalLabel">Title</label>
        <input id="newTitle" value={this.state.newBook.Title} onChange={this.updateBookDetails} ></input>
        <label className="modalLabel">Description</label>
        <input id="newDescription" value={this.state.newBook.Description} onChange={this.updateBookDetails} ></input>
        <menu>
          <button value="cancel" onClick={() => { this.setState({ addNewBook: false }) }} style={{marginRight: "12px"}}>Cancel</button>
          <button
            id="newBookconfirmBtn"
            value="default"
            disabled={!enableAddNewBtn}
            title={enableAddNewBtn ? "" : "All 3 Fileds Above Are Manditory"}
            onClick={this.addNewBook}
            style={enableAddNewBtn ? {} : { cursor: "not-allowed" }}>
            Confirm
            </button>
        </menu>
      </div >
    );


    return (
      <div className="container">
        <Header />
        <button onClick={this.enableInputForAddNewBook}>Add A New Book</button>
        {this.state.addNewBook ? addANewBook : ""}

        <ReactTable
          data={this.state.tableData}
          columns={columns}
          pageSize={5}
          defaultFilterMethod={this.reactTableFilter}
        />


        <dialog id="favDialog" style={{ width: 350, height: 200 }}>
          <form method="dialog">
            <div>
              <label className="modalLabel">Author</label>
              <input className="modalValue" id="modalAuthor" value={this.state.modal.Author} onChange={this.updateBookDetails} ></input>
            </div>
            <div>
              <label className="modalLabel">Title</label>
              <input className="modalValue" id="modalTitle" value={this.state.modal.Title} onChange={this.updateBookDetails}></input>
            </div>
            <div>
              <label className="modalLabel">Description</label>
              <input className="modalValue" id="modalDescription" value={this.state.modal.Description} onChange={this.updateBookDetails}></input>
            </div>
            <menu>
              <button value="cancel" style={{marginRight: "12px"}}>Cancel</button>
              <button
                id="updateModalconfirmBtn"
                value="default"
                onClick={this.editABook}
                disabled={!enableUpdateBtn}
                title={enableUpdateBtn ? "" : "All 3 Above Fileds Are Manditory"}
                style={enableUpdateBtn ? {} : { cursor: "not-allowed" }}>
                Confirm
              </button>
            </menu>
          </form>
        </dialog>
      </div>
    );
  }
}

render(
  <Main />,
  document.getElementById("app")
);