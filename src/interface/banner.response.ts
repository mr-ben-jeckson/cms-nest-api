export interface FormattedBanner {
    id: number,
    key: string, 
    mediaId: string,
    url: string,
    header: string,
    intro: string,
    button?: boolean,
    buttonName?: string,
    buttonLink?: string
}