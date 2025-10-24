import Product from "../model/Product.js";
import WarehouseModel from "../model/warehouse.js";
export const AddProduct = async (req, res) => {
  try {
    console.log(req.body);
    const {
      id,
      name,
      category,
      stock,
      minStock,
      maxStock,
      price,
      supplier,
      location,
      status,
    } = req.body;
    if (
      !name ||
      !category ||
      !stock ||
      !minStock ||
      !maxStock ||
      !price ||
      !supplier
    ) {
      return res.status(403).json({ message: "All fields are required" });
    }
    
    const product = await Product.create({
      id,
      name,
      category,
      stock,
      minStock,
      maxStock,
      price,
      supplier,
      location,
      status,
user:req.user.id  
  });
    console.log(product)
    return res
      .status(200)
      .json({ message: "Product added successfully", product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong", err });
  }
};

export const SendProductDetails = async (req, res) => {
  try {
    console.log("Shivam")
    const productData = await Product.find({ user: req.user.id });
    console.log(productData)
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const updateInventoryByID = async (req, res) => {
  try {
    console.log("Shivam req")
    const { id } = req.params;
    const { action } = req.body;
    const userId = req.user.id; // comes from your JWT middleware

    if (!["increment", "decrement"].includes(action)) {
      return res.status(400).json({ success: false, message: "Invalid action" });
    }

    // ✅ Find the product that belongs to the logged-in user
    const product = await Product.findOne({ _id: id, user: userId });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or not authorized to update",
      });
    }

    // ✅ Update stock based on action
    if (action === "increment") {
      product.stock = (product.stock || 0) + 1;
    } else if (action === "decrement") {
      if (product.stock > 0) {
        product.stock -= 1;
      } else {
        return res.status(400).json({
          success: false,
          message: "Stock already 0, cannot decrement further",
        });
      }
    }

    // ✅ Save updated product
    await product.save();
    console.log("shivam ")
  console.log(product)
    return res.status(200).json({
      success: true,
      message: `Stock ${action}ed successfully`,
      data: product,
    });
  } catch (error) {
    console.error("Error updating inventory:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const SendSingleProductDetails = async (req, res) => {
  try {
    const productData = await Product.findById({ user: req.user.id , _id:req.params.id});
    console.log(productData)
    return res.status(200).json(productData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
export const DeleteProduct = async (req, res) => {
  try {
    console.log(req.params)
    const { id } = req.params; // take from route, not body
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

const deletedProduct = await Product.findOneAndDelete({
      _id: id,
      user: req.user.id // <-- only allow deletion if product belongs to user
    });   

    if (!deletedProduct) {
      return res.status(404).json({ message: "No product with given ID found" });
    }
console.log("Shivam")
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
  const updatedProduct = await Product.findOneAndUpdate(
      { _id: id, user: req.user.id }, // <-- only update user's product
      updateData,
      { new: true, runValidators: true }
    );

console.log(updatedProduct)
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
console.log(updatedProduct)
    return res.status(200).json(updatedProduct);
    
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Failed to update product", error });
  }
};