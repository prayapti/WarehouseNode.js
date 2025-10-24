import AnnualReport from "../model/AnnualReport.js";

export const getAnnualReport = async (req, res) => {
  try {
    const reports = await AnnualReport.find().sort({ month: 1 });
    res.json(reports);
  } catch (error) {
    console.error("Error fetching annual reports:", error);
    res.status(500).json({ message: "Failed to fetch annual reports" });
  }
};

export const createAnnualReport = async (req, res) => {
  try {
    const report = new AnnualReport(req.body);
    await report.save();
    res.status(201).json(report);
  } catch (error) {
    console.error("Error creating annual report:", error);
    res.status(500).json({ message: "Failed to create annual report" });
  }
};
