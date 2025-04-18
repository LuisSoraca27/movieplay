import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCourseThunk } from "../features/course/courseSlice";
import "../style/courses.css";
import CardCourse from "../Components/CardCourse";
import { setIsLoading } from "../features/isLoading/isLoadingSlice";
import IsLoading from "../Components/IsLoading";
import ModalProduct from "./ModalProduct";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";
import RegisterOrderByProduct from "../Components/Order/RegisterOrderByProduct";


const Course = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [dataOrder, setDataOrder] = useState(null);
  const [reload, setReload] = useState(false);
  const [isCommunityPanelOpen, setIsCommunityPanelOpen] = useState(true);

  const handleCardClick = (course) => {
    setModalData({
        product: course,
        open: isModalOpen,
        type: "course",
      });
    setDataOrder(course)
    setIsModalOpen(true);
  };

  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses);
  const isLoadingState = useSelector((state) => state.isLoading);

  const renderModal = () => {
    if (user?.role === "admin") {
      return (
        <RegisterOrderByProduct
          data={modalData}
          onClose={() => setIsModalOpen(false)}
          typeAccountProp={"profile"}
        />
      );
    }

    return (
      <ModalProduct
        data={modalData}
        onClose={() => setIsModalOpen(false)}
        reCharge={() => setReload(!reload)}
      />
    );
  };

  useEffect(() => {
    dispatch(setBalanceThunk(user.id));
    dispatch(setIsLoading(true));
    dispatch(setCourseThunk()).finally(() => {
      dispatch(setIsLoading(false));
    });
  }, [reload]);

  return (
    <>
      <ViewNotificationImg />
      {isLoadingState ? (
        <IsLoading />
      ) : (
        <>
          <div className="container-title">
            <h1>Cursos </h1>
            <p>Encuentra aqui infiniad de cursos y recursos</p>
          </div>
          <div className="container-course">
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <CardCourse
                  course={course}
                  key={index}
                  onClick={() =>
                    handleCardClick(course)
                  }
                />
              ))
            ) : (
              <h1
                style={{ color: "white", textShadow: " 3px 3px 2px #000000" }}
              >
                No hay cursos disponibles{" "}
              </h1>
            )}
            {isCommunityPanelOpen && (
              <CommunitiesPanel
                onClose={() => setIsCommunityPanelOpen(false)}
              />
            )}
          </div>
        </>
      )}
      {isModalOpen && renderModal()}
    </>
  );
};

export default Course;
