import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import DataTable from "./DataTable";
import { Link } from "react-router-dom";
const useStyles = makeStyles({
  root: {
    width: 300,
  },
});
function valuetext(value) {
  return value;
}
function Home(props) {
  const classes = useStyles();
  const [value, setValue] = useState([0, 3000]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState("");
  useEffect(() => {
    async function getData() {
      const request = await fetch(
        "https://filter-reactjs.herokuapp.com/products"
      );
      const newData = await request.json();
      setData(newData);
    }
    getData();
  }, []);


  function filterDelete(delete1, id) {
    let newArray = delete1.filter((item) => item.id !== id);
    setData(newArray);
  }

  function search(rows) {
    return rows && rows.filter((row) => {
      if (searchData === "") {
        return row.price >= value[0] && row.price <= value[1];
      } else {
        return (
          row.name.toLowerCase().indexOf(searchData.toLowerCase()) > -1 ||
          row.type.toLowerCase().indexOf(searchData.toLowerCase()) > -1 ||
          (row.origin.toLowerCase().indexOf(searchData.toLowerCase()) > -1 &&
            row.price >= value[0] &&
            row.price <= value[1])
        );
      }
    });
  }
  function update123(items) {
    let newItems = items;
    let newSumData = [...data];
    let index = newSumData.findIndex((obj) => obj.id === newItems.id);
    newSumData[index] = newItems; // thay đổi dataItems trong mảng
    setData(newSumData);
  }
  return (
    <div className="main-content">
      <div className="container">
        <Button variant="success" className="button-creacte">
          <Link to="/create" className="create-link">
            <i className="fas fa-plus"></i> Create New Product
          </Link>
        </Button>
        <div className="filter-search">
          <div className="left">
            <input
              type="text"
              placeholder="Search by name, type,..."
              className="search-input"
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
            />
          </div>
          <div className="right">
            <div className={classes.root}>
              <Typography id="range-slider" gutterBottom>
                Price
              </Typography>
              <Slider
                value={value}
                min={0}
                max={10000}
                step={1.5}
                onChange={handleChange}
                valueLabelDisplay="auto"
                aria-labelledby="range-slider"
                getAriaValueText={valuetext}
              />
            </div>
          </div>
        </div>
        <DataTable
          rows={search(data)}
          filter_Delete={filterDelete}
          updateHome={update123}
        ></DataTable>
      </div>
    </div>
  );
}
export default Home;
