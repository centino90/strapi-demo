import 'bootstrap/dist/css/bootstrap.css';
import bootstrap from 'bootstrap/dist/js/bootstrap';
import './App.css';
import React from 'react'

// const apiToken = `b4d784ef8a5b9ad039100cd1f0b68a7e4494435eb91be261860414560de4567f76dfea9778ae88d954b9b57def4e6791736192214c63dc8923f93daae8be11e50c73066b76219fd88950bdbe4a9d9b888c1cc9b4d7cd793260fa5fb378b09d55f0048046ba7a40b756448d75f11fe4bad13f3aa85a25a0f73640173c868032de`
const apiToken = `a8ae012e1993b9ae4fd6521bdf60a0b26f338e0aa1a05dc868ab6d2760924177469d66f7f5904c98b3ac52b2dd9aaabfcdf5a5a2af4a783ad223a0abf35a4a6fe9b8a5831b0acdcdb82ab37f51ec54cfcf8d79470b0adc97f81e9d8a346f25eb1eb5cfc7c747cf0b1f45b1796245b4d43e41842a5edee1ee4422ff9672e791d7`
// const backendHost = 'https://strapi-backend-9zpt.onrender.com'
const backendHost = 'http://localhost:1337'

function TableRows({ rows, handleEditButtonClick }) {
  const elements = []
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    elements.push(TableRow(row, handleEditButtonClick))
  }
  return elements
}

function TableRow(row, handleEditButtonClick) {
  return (
    <tr key={row.id}>
      <td>{row.attributes.createdAt}</td>
      <td>{row.attributes.updatedAt}</td>
      <td>{row.attributes.title}</td>
      <td>{row.attributes.description}</td>
      <td>
        <button onClick={() => {
          console.log('handleSetEditableArticleId(row.id)', row.id)
          handleEditButtonClick(row.id)
        }} className="btn btn-secondary" type="button" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
      </td>
    </tr>
  )
}

function NavigationItem(pageCount, currentPage) {
  if (pageCount + 1 == currentPage) {
    return (
      <li key={pageCount} className="page-item"><a className="page-link active" href="#">{pageCount + 1}</a></li>
    )
  }

  return (
    <li key={pageCount} className="page-item"><a className="page-link" href="#">{pageCount + 1}</a></li>
  )
}
function NavigationItems({ pagination }) {
  const elements = []
  for (let index = 0; index < pagination.pageCount; index++) {
    elements.push(NavigationItem(index, pagination.page))
  }

  return elements
}

function Navigation({ navigationMeta, handlerArticlesFetch }) {
  const page = navigationMeta.pagination.page
  const pageCount = navigationMeta.pagination.pageCount
  return (
    <div className="d-flex justify-content-center">
      <nav aria-label="Page navigation example">
        <ul className="pagination">
          <li onClick={() => handlerArticlesFetch(page > 1 ? page - 1 : 1, false)} className="page-item"><a className="page-link" href="#">Previous</a></li>
          <NavigationItems pagination={navigationMeta.pagination} />
          <li onClick={() => handlerArticlesFetch(page < pageCount ? page + 1 : pageCount, true)} className="page-item"><a className="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  )
}

function InsertForm({ handlerArticleInsert }) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" aria-describedby="emailHelp" value={title} onChange={(e) => setTitle(e.target.value ?? '')} />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input type="text" className="form-control" id="description" value={description} onChange={(e) => setDescription(e.target.value ?? '')} />
      </div>
      <button onClick={(e) => {
        e.preventDefault()
        handlerArticleInsert(title, description)
        setTitle('')
        setDescription('')
      }} type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}

function UpdateForm({ handlerArticleUpdate}) {
  const [title, setTitle] = React.useState('')
  const [description, setDescription] = React.useState('')

  return (
    <form>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">Title</label>
        <input type="text" className="form-control" id="title" aria-describedby="emailHelp" value={title} onInput={(e) => setTitle(e.target.value ?? '')} />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <input type="text" className="form-control" id="description" value={description} onInput={(e) => setDescription(e.target.value ?? '')} />
      </div>
      <button onClick={(e) => {
        e.preventDefault()
        handlerArticleUpdate(title, description)
        setTitle('')
        setDescription('')
      }} type="submit" className="btn btn-primary">Submit</button>
    </form>
  )
}

function App() {
  const [articles, setArticles] = React.useState(null)
  const [navigationMeta, setNavigationMeta] = React.useState(null)
  const [editableArticleId, setEditableArticleId] = React.useState(null)
  // const [isNavigatedForward, setIsNavigatedForward] = React.useState(null)

  function handleArticlesFetch(page = 1, navigated = null) {
    console.log('====PAGE', page, navigated)
    const URL = `${backendHost}/api/Articles?pagination[page]=${page}&pagination[pageSize]=5&sort[0]=createdAt:desc`
    const f = fetch(URL, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })
    if (navigated !== null) {
      // setIsNavigatedForward(navigated)
      f.then(res => res.json())
        .then((data) => {
          setArticles(data.data)
          setNavigationMeta(data.meta)
        })
    }
    return f
  }

  function handleArticleInsert(title, description) {
    const URL = `${backendHost}/api/Articles`
    const f = fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "data": {
          "title": title,
          "description": description
        }
      })
    }).then(res => res.json()).then(data => {
      handleArticlesFetch(1, true)
    })
  }

  function handleArticleUpdate(title, description) {
    const URL = `${backendHost}/api/Articles/${editableArticleId}`
    const f = fetch(URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "data": {
          "title": title,
          "description": description
        }
      })
    }).then(res => res.json()).then(data => {
      handleArticlesFetch(navigationMeta.pagination.page, true)
    })
  }

  function handleEditButtonClick(rowID) {
    setEditableArticleId(rowID)
  }

  React.useEffect(() => {
    setTimeout(() => {
      handleArticlesFetch()
        .then(res => res.json())
        .then((data) => {
          setArticles(data.data)
          setNavigationMeta(data.meta)
        })

    }, 100);
  }, []);

  React.useEffect(() => {
    console.log({ articles, navigationMeta })
  }, [articles, navigationMeta, editableArticleId]);

  if (!articles || !navigationMeta) {
    return (
      <div className="container bg-white p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="container bg-white p-5">
          <h1 className="text-dark text-start mb-5">Articles</h1>
          <div className="d-flex justify-content-end mb-4">
            <button className="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target="#insertModal">Insert New</button>
          </div>
          <table className="table table-sm">
            <thead>
              <tr>
                <th scope="col">created</th>
                <th scope="col">updated</th>
                <th scope="col">title</th>
                <th scope="col">description</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <TableRows rows={articles} handleEditButtonClick={handleEditButtonClick}/>
            </tbody>
          </table>
          <Navigation navigationMeta={navigationMeta} handlerArticlesFetch={handleArticlesFetch} />
        </div>
      </header>

      <div className="modal fade" id="insertModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Insert Article</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <InsertForm handlerArticleInsert={handleArticleInsert} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="editModalLabel">Update Article</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <UpdateForm handlerArticleUpdate={handleArticleUpdate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
