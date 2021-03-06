import React, { useState, useContext } from "react";
import { Button, Modal, Container, Row, Col } from "react-bootstrap";
import { useParams, useHistory, Link } from "react-router-dom";
import { useQuery, useMutation } from "react-query";
import { API, urlAsset } from "../Config/api";
import { BiCloudDownload } from "react-icons/bi";
import { FaRegBookmark } from "react-icons/fa";
import { GlobalContext } from "../Context/GlobalContext";
import Spinner from "../Components/Utilities/Spinner";
import Header from "../Components/Utilities/Header";

const DetailLiterature = () => {
  const history = useHistory();

  const [show, setShow] = useState(false);

  const [state, dispatch] = useContext(GlobalContext);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [bookmark, setBookmark] = useState(false);

  const [add, setAdd] = useState(false);
  const [message, setMessage] = useState("");

  const [userId, setUserId] = useState(null);
  const [literatureId, setLiteratureId] = useState(null);
  const [bookmarkId, setBookmarkId] = useState(null);

  const { id } = useParams();

  const {
    isLoading,
    error,
    data: detailLiterature,
    refetch,
  } = useQuery("getDetail", () => API.get(`/literature/${id}`));

  // function checkBookmark() {
  //   const bookmark = detailLiterature.data.data.literature.collections.some(
  //     (bookmark) =>
  //       detailLiterature.data.data.literature.id === bookmark.LiteratureId &&
  //       state.user.id === bookmark.userId
  //   );
  //   console.log(bookmark);
  //   return bookmark;
  // }

  // const [addBookmark] = useMutation(async () => {
  //   try {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };

  //     const body = JSON.stringify({
  //       literatureId: `${literatureId}`,
  //       userId: `${userId}`,
  //     });
  //     const res = await API.post("collection/", body, config);
  //     refetch();
  //     return res;
  //   } catch (error) {
  //     console.log(error);
  //     setMessage(error.response.data.error.message);
  //   }
  // });

  // const [deleteBookmark] = useMutation(async () => {
  //   try {
  //     const res = await API.delete(`/collection/${bookmarkId}`);
  //     refetch();
  //   } catch (error) {
  //     refetch();
  //     console.log(error);
  //   }
  // });

  const [addCollection] = useMutation(async (literatureId) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ literatureId: literatureId });

      const res = await API.post(`/collection/`, body, config);
      setMessage(res.data.message);
    } catch (err) {
      console.log(err);
      setMessage(err.response.data.error.message);
    }
  });

  return isLoading || !detailLiterature ? (
    <Spinner />
  ) : error ? (
    <h1>Your Error : {error.message}</h1>
  ) : (
    <>
      <Header />
      <div id="detail-literature">
        <Container>
          <Row>
            <Col lg={5}>
              <div className="image-container">
                <img
                  className="image"
                  src={require("../Assets/Images/pdfCover.png")}
                  alt=""
                />
              </div>
            </Col>
            <Col lg={5}>
              <div className="information">
                <h1 className="title">
                  {detailLiterature.data.data.literature.title}
                </h1>
                <h2 className="author">
                  {detailLiterature.data.data.literature.author}
                </h2>
                <p className="bold-text">Publication Date</p>
                <p className="regular-text">
                  {detailLiterature.data.data.literature.publication}
                </p>
                <p className="bold-text">Pages</p>
                <p className="regular-text">
                  {detailLiterature.data.data.literature.page}
                </p>
                <p className="bold-text">ISBN</p>
                <p className="regular-text">
                  {detailLiterature.data.data.literature.isbn}
                </p>
                <div>
                  <br />
                  <br />
                  <br />
                  {/* <Link
                    to={`http://localhost:5000/uploads/pdf/${detailLiterature.data.data.literature.file}`}
                    target="_blank"
                    download
                  > */}
                  <Button
                    // href={`http://localhost:5000/uploads/pdf/${detailLiterature.data.data.literature.file}`}
                    href={
                      urlAsset.pdf + detailLiterature.data.data.literature.file
                    }
                    target="_blank"
                  >
                    Download{" "}
                    <BiCloudDownload style={{ width: 25, height: 25 }} />
                  </Button>
                  {/* </Link> */}
                </div>
              </div>
            </Col>
            <Col lg={2}>
              {/* {detailLiterature.data.data.literature.user.id !=
              state.user.id ? (
                <div>
                  {checkBookmark() === true ? (
                    <Button
                      onClick={() => {
                        setBookmarkId(
                          detailLiterature.data.data.literature.collections[0]
                            .id
                        );
                        deleteBookmark();
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        setLiteratureId(
                          detailLiterature.data.data.literature.id
                        );
                        setUserId(state.user.id);
                        addBookmark();
                        setShowAddModal(true);
                      }}
                    >
                      Add
                    </Button>
                  )}
                </div>
              ) : null} */}

              <Button
                onClick={() => {
                  addCollection(detailLiterature.data.data.literature.id);
                  setShowAddModal(true);
                }}
                style={{ width: 200, float: "right" }}
              >
                Add to Collection <FaRegBookmark />
              </Button>

              {/* <Button style={{ width: 200, float: "right" }}>
                Add to Collection <FaRegBookmark />
              </Button> */}
            </Col>

            {/* MODAL ADD BOOKMARK */}
            <Modal
              centered
              show={showAddModal}
              onHide={() => setShowAddModal(false)}
            >
              <Modal.Body>
                Literature has been added to your collection
              </Modal.Body>
            </Modal>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default DetailLiterature;
