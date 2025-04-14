import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../context/contextapi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Login = () => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
      image: "/images/banner3.jpg",
      title:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
      text: "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
    {
      image: "/images/banner.avif",
      title: "Duis aute irure dolor in reprehenderit in voluptate",
      text: "Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      image: "/images/banner4.avif",
      title: "Sed ut perspiciatis unde omnis iste natus error",
      text: "Sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);

    try {
      const result = await loginUser(formData);
      if (result.success) {
        // toast.success(result.data.msg);
        Cookies.set("token", result.data.token, { expires: 2 / 24 });
        navigate("/candidates");
        // toast.success(result.data.msg,
        //     {
        //   onClose: () => {
        //     localStorage.setItem('token', result.data.token);
        //     navigate('/candidates');
        //   },
        // });
        setFormData({ email: "", password: "" });
        setValidated(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPassword(true);
    // You can implement forgot password functionality here
    console.log("Forgot password for:", formData.email);
  };

  return (
    <div className="login-wrapper">
      <Container className="p-0">
        <div className="main-logo">
          <div className="logo">
            <span className="logo-square"></span>LOGO
          </div>
        </div>

        <Row className="g-0">
          <Col md={6} className="left-panel">
            <div className="slider-container">
              <div className="slider">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`slide ${
                      index === currentSlide ? "active" : ""
                    }`}
                    style={{
                      transform: `translateX(${100 * (index - currentSlide)}%)`,
                    }}
                  >
                    <img
                      src={slide.image}
                      alt={`Slide ${index + 1}`}
                      className="slide-image"
                    />
                    <h3>{slide.title}</h3>
                    <p>{slide.text}</p>
                  </div>
                ))}
              </div>

              <div className="slider-dots">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    className={`slider-dot ${
                      index === currentSlide ? "active" : ""
                    }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            </div>
          </Col>

          <Col md={6} className="right-panel">
            <div className="login-form">
              <h2>Welcome to Dashboard</h2>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>
                    Email Address<span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>
                    Password<span className="required">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Please enter your password.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="forgot-password-link">
                  <a href="#forgot-password" onClick={handleForgotPassword}>
                    Forgot password?
                  </a>
                </div>

                <div className="d-grid mt-4">
                  <Button type="submit" className="login-button">
                    Login
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="register-text">
                    Don't have an account?
                    <Link
                      to="/"
                      className="register-link"
                      // onClick={() => navigate("/login")}
                    >
                      Register
                    </Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
