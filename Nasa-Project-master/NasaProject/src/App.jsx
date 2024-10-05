import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./components/Home/Home";
import Prediction from "./components/Prediction/Prediction";


const routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <h1>ERROR!!!!</h1>,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/predict",
        element: <Prediction/>,
      }
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={routes}></RouterProvider>
    </>
  );
}

export default App;
