import React,{useEffect, useState} from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
function Update(props) {
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data, e) => {
      fetch("https://filter-reactjs.herokuapp.com/products", {
        method: "PUT",
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
          console.log("Success:");
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      e.target.reset();
      alert("Cập nhật sản phẩm thành công");
  };
  const prams = useParams();
  const { slug } = prams;
  const [updateProduct, setProductUpdate] = useState([]);
  useEffect(() => {
    async function getProductUpdate() {
      const response = await fetch("https://filter-reactjs.herokuapp.com/products?slug=" + slug);
      const updated = await response.json();
      setProductUpdate(updated);
      console.log(updateProduct);
    }
    getProductUpdate();
  }, []);

  return (
    <>
      <div className="container container-create">
        <div className="row-create">
          <h1>Update Product</h1>
          <form className="form-create" onSubmit={handleSubmit(onSubmit)}>
            <input
              type="text"
              id="name"
              name="name_update"
              placeholder="Name product"
              aria-invalid={errors.name_update ? "true" : "false"}
              ref={register({ required: true, maxLength: 30 })}
            />
            {errors.name_update && errors.name_update.type === "required" && (
              <span role="alert" className="errors">
                This is required
              </span>
            )}
            {errors.name_update && errors.name_update.type === "maxLength" && (
              <span role="alert" className="errors">
                Max length exceeded
              </span>
            )}
            <input
              type="number"
              id="price"
              name="price_update"
              placeholder="Price"
              ref={register({
                required: true,
                min: 0,
                max: 1000,
              })}
            />
            {errors.price_update && errors.price_update.type === "required" && (
              <span className="errors">This is required</span>
            )}
            {errors.price_update && errors.price_update.type === "min" && (
              <span className="errors">
                Price should not be less than 0 and greater than 1000
              </span>
            )}
            {errors.price_update && errors.price_update.type === "max" && (
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
        </div>
        <Button className="button-go-back" variant="outline-primary">
          <Link to="/" className="go-back">
            <i className="fas fa-arrow-left"></i>&nbsp;Go Back
          </Link>
        </Button>
      </div>
    </>
  );
}

export default Update;
