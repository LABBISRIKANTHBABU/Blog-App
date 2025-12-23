
import exceljs from 'exceljs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

class ExportService {
    async exportToExcel(posts) {
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Blog Posts');

        worksheet.columns = [
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Author', key: 'username', width: 20 },
            { header: 'Category', key: 'categories', width: 20 },
            { header: 'Date Created', key: 'createdDate', width: 20 },
            { header: 'Content', key: 'description', width: 50 }
        ];

        posts.forEach(post => {
            worksheet.addRow({
                title: post.title,
                username: post.username,
                categories: post.categories,
                createdDate: post.createdDate, // Assuming date is stored or needs formatting
                description: post.description
            });
        });

        // Basic styling
        worksheet.getRow(1).font = { bold: true };

        return await workbook.xlsx.writeBuffer();
    }

    async exportToWord(post) {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        text: post.title,
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: `By ${post.username} | ${post.categories} | ${new Date().toLocaleDateString()}`,
                        spacing: { after: 200 },
                    }),
                    new Paragraph({
                        children: [
                            new TextRun(post.description), // Content
                        ],
                    }),
                ],
            }],
        });

        return await Packer.toBuffer(doc);
    }
}

export default new ExportService();
