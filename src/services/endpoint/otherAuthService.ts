
export interface LoginResponseDTO {
    token: string;
}  

export const redirectToGoogleAuth = (): void => {
      window.location.href = "https://fulldevapi.online/oauth2/authorization/google"
  };

export const redirectToFacebookAuth = (): void =>{
    window.location.href = "https://fulldevapi.online/oauth2/authorization/facebook"
}
  