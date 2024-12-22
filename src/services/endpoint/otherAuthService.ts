
export interface LoginResponseDTO {
    token: string;
}  

export const redirectToGoogleAuth = (): void => {
      window.location.href = process.env.NEXT_PUBLIC_API_GOOGLE_URL || ""
  };

export const redirectToFacebookAuth = (): void =>{
    window.location.href = process.env.NEXT_PUBLIC_API_FACEBOOK_URL || ""
}
  