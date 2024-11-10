import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KakaoLoginSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // URL에서 토큰 추출
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    const refreshToken = urlParams.get('refreshToken');

    if (accessToken && refreshToken) {
      console.log("토큰이 감지되었습니다.");
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // 저장 후 /select-type으로 이동
      setTimeout(() => {
        navigate('/select-type');
      }, 100);
    } else {
      console.error('토큰이 없습니다. 로그인에 실패했습니다.');
      alert('로그인에 실패했습니다.');
    }
  }, [navigate]);

  return (
    <div>
      <h2>로그인 처리 중...</h2>
    </div>
  );
}
