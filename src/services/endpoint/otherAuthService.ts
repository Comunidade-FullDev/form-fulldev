
export interface LoginResponseDTO {
    token: string;
}  

export const redirectToGoogleAuth = (): void => {
      window.location.href = "http://ec2-18-226-164-76.us-east-2.compute.amazonaws.com:8080/oauth2/authorization/google"
  };

export const redirectToFacebookAuth = (): void =>{
    window.location.href = "http://ec2-18-226-164-76.us-east-2.compute.amazonaws.com:8080/oauth2/authorization/facebook"
}
  