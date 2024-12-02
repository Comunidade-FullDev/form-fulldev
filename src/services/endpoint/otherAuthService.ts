
export interface LoginResponseDTO {
    token: string;
}  

export const redirectToGoogleAuth = (): void => {
      window.location.href = "http://localhost:8080/login/google-auth-url";
    
  };

export const redirectToFacebookAuth = (): void =>{
    window.location.href = "http://localhost:8080/login/facebook-auth-url"
}
  