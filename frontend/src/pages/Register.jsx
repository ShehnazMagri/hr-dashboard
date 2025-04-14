import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import {
  FaEye,
  FaEyeSlash,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "./../context/contextapi";
import { toast } from "react-toastify";

const Register = () => {
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 3;

  const slides = [
    {
        image: "/images/banner3.jpg",
        title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod",
        text: "tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
        image: "/images/banner.avif",
        title: "Duis aute irure dolor in reprehenderit in voluptate",
        text: "Velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
        image: "/images/banner4.avif",
        title: "Sed ut perspiciatis unde omnis iste natus error",
        text: "Sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."
    }
];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword") {
        setPasswordMatch(value === formData.password);
      } else {
        setPasswordMatch(
          value === formData.confirmPassword || formData.confirmPassword === ""
        );
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false || !passwordMatch) {
      event.stopPropagation();
      setValidated(true);
      if (!passwordMatch) {
        toast.error("Passwords do not match.");
      }
      return;
    }

    setValidated(true);

    try {
      const result = await registerUser(formData);
      if (result.success) {
        toast.success(result.data.msg, {
          onClose: () => navigate("/login"), // Navigate to login after toast closes
        });
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setValidated(false);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="registration-wrapper">
      <Container className="p-0">
        <div className="main-logo">
          <div className="logo">
            <span className="logo-square"></span>LOGO
          </div>
        </div>

        <Row className="g-0">
          <Col md={6} className="left-panel">
            <div className="logo-container">
              <div className="logo">
                <span className="logo-square"></span>LOGO
              </div>
            </div>

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

              <div className="slider-controls">
                <div className="slider-dots">
                  {Array.from({ length: totalSlides }).map((_, index) => (
                    <button
                      key={index}
                      className={`slider-dot ${
                        index === currentSlide ? "active" : ""
                      }`}
                      onClick={() => goToSlide(index)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </Col>

          <Col md={6} className="right-panel">
            <div className="registration-form">
              <h2>Welcome to Dashboard</h2>

              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label>
                    Full name<span className="required">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Full name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide your full name.
                  </Form.Control.Feedback>
                </Form.Group>

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
                      minLength={8}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Password must be at least 8 characters.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-4" controlId="formConfirmPassword">
                  <Form.Label>
                    Confirm Password<span className="required">*</span>
                  </Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      isInvalid={!passwordMatch && validated}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      Passwords do not match.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>

                <div className="d-grid">
                  <Button type="submit" className="register-button">
                    Register
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <p className="login-text">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="login-link"
                      // onClick={() => navigate("/login")}
                    >
                      Login
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

export default Register;
