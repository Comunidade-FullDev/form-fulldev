
export interface LoginResponseDTO {
    token: string;
}  

export const redirectToGoogleAuth = (): void => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google"
  };

export const redirectToFacebookAuth = (): void =>{
    window.location.href = "http://localhost:8080/oauth2/authorization/facebook"
}
  