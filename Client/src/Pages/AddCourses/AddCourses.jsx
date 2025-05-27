import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Spin,
  Upload,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { IoCalendarNumberOutline } from "react-icons/io5";

//components
import Navbar from "../../Components/Sidebar/Navbar";
import Header from "../../Components/Header/Header";

//css imports
import "./AddCourses.css";
import { tutorLogin } from "../../Redux/auth/action";

const { TextArea } = Input;

const AddCourses = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  // State variables
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  // Redux states
  const {
    data: { isAuthenticated },
  } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      return navigate("/");
    }
    fetchCourses();
  }, []);
  const token = localStorage.getItem("token");

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://170.64.141.16:8080/subject/all");
      const data = await response.json();
      if (response.ok) {
        setCourses(data.subjects);
      } else {
        messageApi.error("Failed to fetch courses");
      }
    } catch (error) {
      messageApi.error("Error fetching courses");
    } finally {
      setLoading(false);
    }
  };
  console.log(courses);
  // Create new course
  const handleCreateCourse = async (values) => {
    setCreateLoading(true);
    try {
      const response = await fetch("http://170.64.141.16:8080/subject/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          tutorId: "6819ba46d55c66f78a1868e4",
          startDate: values.startDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          endDate: values.endDate.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          photoUrl: imageUrl || "default-course-image.png",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        messageApi.success("Course created successfully");
        form.resetFields();
        setImageUrl(null);
        setIsModalVisible(false);
        fetchCourses();
      } else {
        messageApi.error(data.message || "Failed to create course");
      }
    } catch (error) {
      messageApi.error("Error creating course");
    } finally {
      setCreateLoading(false);
    }
  };

  // Handle image upload (mock implementation)
  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      // In a real app, you would upload to your server and get the URL
      setImageUrl(`photo-${Date.now()}.png`);
      messageApi.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      messageApi.error(`${info.file.name} file upload failed.`);
    }
  };

  // Delete course
  const handleDeleteCourse = async (courseId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://170.64.141.16:8080/subject/delete/${courseId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        messageApi.success("Course deleted successfully");
        fetchCourses();
      } else {
        messageApi.error("Failed to delete course");
      }
    } catch (error) {
      messageApi.error("Error deleting course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Navbar>
      <div className="admin">
        {contextHolder}

        {/* Header component */}
        <Header Title={"Add Courses"} Address={"Add Courses"} />

        {/* Add Course Button */}
        <div className="add-course-btn-container">
          <Button
            className="add-course-btn"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Add New Course
          </Button>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="loading-state">
            <Spin size="large" />
          </div>
        ) : (
          <div className="courses-grid">
            {courses?.map((course) => (
              <Card
                className="course-card"
                key={course._id}
                cover={
                  <div
                    className="course-image"
                    style={{ backgroundImage: `url(${course.photoUrl})` }}
                  />
                }
                actions={[
                  <div className="action-btn edit-btn" key="edit">
                    <EditOutlined />
                  </div>,
                  <div
                    className="action-btn delete-btn"
                    key="delete"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    <DeleteOutlined />
                  </div>,
                ]}
              >
                <div className="course-content">
                  <h3 className="course-title">{course.name}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span className="course-price">
                      {course.price.toLocaleString()} UZS
                    </span>
                    <span className="course-duration">
                      <IoCalendarNumberOutline />
                      {new Date(course.startDate).toLocaleDateString()} -{" "}
                      {new Date(course.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Add Course Modal */}
        <Modal
          title="Create New Course"
          visible={isModalVisible}
          onCancel={() => {
            form.resetFields();
            setIsModalVisible(false);
            setImageUrl(null);
          }}
          footer={null}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleCreateCourse}
            autoComplete="off"
          >
            <Form.Item
              name="name"
              label="Course Name"
              rules={[{ required: true, message: "Please input course name!" }]}
            >
              <Input placeholder="Enter course name" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: "Please input description!" }]}
            >
              <TextArea rows={4} placeholder="Enter course description" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price (UZS)"
              rules={[{ required: true, message: "Please input price!" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                min={0}
              />
            </Form.Item>

            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: "Please select start date!" }]}
            >
              <DatePicker style={{ width: "100%" }} showTime />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="End Date"
              rules={[{ required: true, message: "Please select end date!" }]}
            >
              <DatePicker style={{ width: "100%" }} showTime />
            </Form.Item>

            <Form.Item label="Course Image">
              <Upload
                name="photoUrl"
                listType="picture"
                showUploadList={false}
                onChange={handleImageUpload}
                beforeUpload={() => false} // Prevent actual upload in this example
              >
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              {imageUrl && (
                <div style={{ marginTop: 8 }}>
                  <span style={{ color: "#52c41a" }}>Image selected</span>
                </div>
              )}
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={createLoading}
                >
                  Create Course
                </Button>
                <Button
                  onClick={() => {
                    form.resetFields();
                    setIsModalVisible(false);
                    setImageUrl(null);
                  }}
                >
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Navbar>
  );
};

export default AddCourses;
