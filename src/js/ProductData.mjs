function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    // Use absolute path from the root of the site
    this.path = `/json/${this.category}.json`;
  }
  
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data)
      .catch(err => {
        console.error("Error fetching data:", err, "for path:", this.path);
        return [];
      });
  }
  
  async findProductById(id) {
    try {
      const products = await this.getData();
      return products.find((item) => item.Id === id);
    } catch (err) {
      console.error("Error finding product:", err);
      return null;
    }
  }
}