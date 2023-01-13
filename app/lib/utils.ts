import slugify from "slugify";

export const slugString = (str: string) => {
  return slugify(str, {
    lower: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
