import React, { useState } from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import PropTypes from "prop-types";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Modal, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  { id: "price", numeric: true, disablePadding: false, label: "Price" },
  { id: "type", numeric: true, disablePadding: false, label: "Type" },
  { id: "origin", numeric: true, disablePadding: false, label: "Origin" },
  { id: "", numeric: true, disablePadding: false, label: "" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox"></TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
const EnhancedTableToolbar = (props) => {
  return <div></div>;
};
EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};
const useStyles2 = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 10,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

function DataTable({ rows, filter_Delete, updateHome }) {
  const classes2 = useStyles2();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("name");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [show, setShow] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [update, setUpdate] = useState([]);
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const onSubmit = (data) => {
    fetch("https://filter-reactjs.herokuapp.com/products/" + data.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        price: data.price,
        type: data.type,
        origin: data.origin,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Cập nhật sản phẩm thành công");
        updateHome(data);
        console.log("Success:");
        handleClose();
      })
      .catch((error) => {
        handleClose();
        console.error("Error:", error);
      });
  };
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  function deleteData(item) {
    fetch("https://filter-reactjs.herokuapp.com/products/" + item, {
      method: "DELETE",
    }).then((response) => response.json());
    filter_Delete(rows, item);
    alert("Xóa sản phẩm thành công");
  }
  function handleShowUpdate(idu) {
    handleShow();
    fetch("https://filter-reactjs.herokuapp.com/products/" + idu, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setUpdate(data);
      });
  }
  return (
    <>
      <div className="table-container">
        <div className={classes2.root}>
          <Paper className={classes2.paper}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              <Table
                className={classes2.table}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes2}
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(rows, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.name);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          key={row.id}
                          hover
                          onClick={(event) => handleClick(event, row.name)}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                        >
                          <TableCell padding="checkbox"></TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="right">{row.price}</TableCell>
                          <TableCell align="right">{row.type}</TableCell>
                          <TableCell align="right">{row.origin}</TableCell>
                          <TableCell align="right">
                            <div
                              className="action-table"
                              style={{ display: `${row.status}` }}
                            >
                              <button
                                className="action-update"
                                onClick={() => handleShowUpdate(row.id)}
                              >
                                <i className="fas fa-pen-square"></i>
                                <span>Change</span>
                              </button>

                              <button
                                className="action-delete"
                                onClick={() => deleteData(row.id)}
                              >
                                <i className="far fa-trash-alt"></i>{" "}
                                <span>delete</span>
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 20 : 50) * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
          <FormControlLabel
            control={<Switch checked={dense} onChange={handleChangeDense} />}
            label="Dense padding"
          />
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        animation={false}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title class="update">Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="form-create" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              style={{ display: "none" }}
              value={update.id}
              name="id"
              ref={register({ required: true })}
            />
            <input
              type="text"
              id="name"
              name="name"
              defaultValue={update.name}
              placeholder="Name product"
              aria-invalid={errors.name ? "true" : "false"}
              ref={register({ required: true, maxLength: 30 })}
            />
            {errors.name && errors.name.type === "required" && (
              <span role="alert" className="errors">
                This is required
              </span>
            )}
            {errors.name && errors.name.type === "maxLength" && (
              <span role="alert" className="errors">
                Max length exceeded
              </span>
            )}
            <input
              type="text"
              id="price"
              defaultValue={update.price}
              name="price"
              placeholder="Price"
              ref={register({
                required: true,
                min: 0,
                max: 1000,
              })}
            />
            {errors.price && errors.price.type === "required" && (
              <span className="errors">This is required</span>
            )}
            {errors.price && errors.price.type === "min" && (
              <span className="errors">
                Price should not be less than 0 and greater than 1000
              </span>
            )}
            {errors.price && errors.price.type === "max" && (
              <span className="errors">
                Price should not be less than 0 and greater than 1000
              </span>
            )}
            <div className="filter-create">
              <div className="type-create">
                <label for="type">Type</label>
                <select
                  id="type"
                  name="type"
                  defaultValue={update.type}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="different">Other</option>
                  <option value="computer">Computer</option>
                  <option value="car">Car</option>
                  <option value="moto">Motorbike</option>
                  <option value="phone">Phone</option>
                  <option value="washing">Washing</option>
                </select>
              </div>
              <div className="origin-create">
                <label for="origin">Origin</label>
                <select
                  id="origin"
                  name="origin"
                  defaultValue={update.origin}
                  ref={register({
                    required: true,
                  })}
                >
                  <option value="DIFF">Other</option>
                  <option value="US">USA</option>
                  <option value="JP">Japan</option>
                  <option value="VN">VietNam</option>
                  <option value="EU">Europe</option>
                  <option value="KO">Korea</option>
                </select>
              </div>
            </div>
            <Button className="col-12 btn-success" type="submit">
              Update
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default DataTable;
