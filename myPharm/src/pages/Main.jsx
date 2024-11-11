import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function KakaoLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    // Kakao SDK 스크립트 로드 및 초기화
    const script = document.createElement('script');
    script.src = 'https://developers.kakao.com/sdk/js/kakao.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init('ad18681fc821d8cf489a1c4baac7eed4');
        console.log('Kakao is initialized:', window.Kakao.isInitialized());
      }
    };

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(link);
    };
  }, []);

  const handleKakaoLogin = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Auth.authorize({
        redirectUri: 'http:///51.21.23.40/api/login/auth'
      });
    } else {
      console.error('Kakao SDK가 초기화되지 않았습니다.');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      setTimeout(() => {
        navigate('/select-type');
      }, 100);
    }
  }, [navigate]);

  const containerStyle = {
    fontFamily: "'Gowun Batang', serif",
    backgroundColor: '#BFDBFE',
    color: '#374151',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
    border: '1px solid #b3daff',
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: '20px',
  };

  const buttonStyle = {
    background: "url('/images/kakao_login_large_narrow.png') no-repeat center center",
    backgroundSize: 'contain',
    border: 'none',
    width: '100%',
    maxWidth: '300px',
    height: '50px',
    cursor: 'pointer',
    transition: 'opacity 0.3s ease',
    marginTop: '20px',
    marginBottom: '20px'
  };

  return (
    <div style={containerStyle}>
      <header
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          로그인이 필요한 서비스입니다!
        </span>
        <button
          style={{
            padding: "8px",
            borderRadius: "50%",
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            border: "none",
          }}
        >
          <i className="fas fa-list" style={{ color: "#333" }}></i>
        </button>
      </header>

      <div
        style={{
          flexGrow: "1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={cardStyle}>
          <h2 style={titleStyle}>[ 로그인 ]</h2>
          <button 
            onClick={handleKakaoLogin}
            style={buttonStyle}
          />
        </div>
      </div>
    </div>
  );
}
