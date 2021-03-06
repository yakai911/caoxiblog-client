import { useState, useEffect } from "react";
import { getCookie } from "../../actions/auth";
import {
  createCategory,
  listCategories,
  removeCategory,
} from "../../actions/category";

const Category = () => {
  const [values, setValues] = useState({
    name: "",
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false,
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie("token");

  useEffect(() => {
    loadCategories();
  }, [reload]);

  //加载类别数据
  const loadCategories = () => {
    listCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, categories: data });
      }
    });
  };

  //显示所有类别
  const showCategories = () => {
    return categories.map((c, i) => (
      <button
        onDoubleClick={() => deleteConfirm(c.slug)}
        title='双击删除此类别'
        key={i}
        className='btn btn-outline-primary mr-1 ml-1 mt-3'>
        {c.name}
      </button>
    ));
  };

  //验证是否删除类别
  const deleteConfirm = (slug) => {
    let answer = window.confirm("确定要删除这个类别吗?");
    if (answer) {
      deleteCategory(slug);
    }
  };

  //删除类别
  const deleteCategory = (slug) => {
    removeCategory(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: "",
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };

  //提交新类别
  const handleSubmit = (e) => {
    e.preventDefault();
    createCategory({ name }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          name: "",
          reload: !reload,
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      removed: "",
    });
  };

  const showSuccess = () => {
    if (success) {
      return <p className='text-success'>类别创建成功</p>;
    }
  };

  const showError = () => {
    if (error) {
      return <p className='text-danger'>类别已存在</p>;
    }
  };
  const showRemoved = () => {
    if (removed) {
      return <p className='text-danger'>类别已删除</p>;
    }
  };

  const mouseMoveHandler = (e) => {
    setValues({ ...values, error: false, success: false, removed: "" });
  };

  const newCategoryForm = () => (
    <form onSubmit={handleSubmit}>
      <div className='form-group'>
        <label className='text-muted my-2'>类别</label>
        <input
          required
          type='text'
          onChange={handleChange}
          value={name}
          className='form-control'
        />
      </div>
      <div>
        <button className='btn btn-primary form-control my-3' type='submit'>
          创建
        </button>
      </div>
    </form>
  );

  return (
    <>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseMoveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </>
  );
};

export default Category;
