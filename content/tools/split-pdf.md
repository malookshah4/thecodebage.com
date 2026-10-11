Split PDF pulls pages out of a PDF file. Keep only the pages you need, delete a few you don't want, give every page its own file, or cut the file into equal parts. Typical uses: sending the two relevant pages of a long contract, pulling one chapter from a textbook, or separating a scanned stack of receipts.

The file stays on your device the whole time. It is opened and split inside your browser, so nothing is uploaded.

## How to use

1. Tap **Choose a PDF or drop it here** and pick your file. You'll see the file name and how many pages it has.
2. Pick a mode under **What do you want to do?**
   * **Extract pages** makes one new PDF with only the pages you list.
   * **Remove pages** makes one new PDF with the pages you list taken out.
   * **Split every page** makes one PDF for each page, packed into a ZIP file.
   * **Split into chunks** makes PDFs of a fixed number of pages each, also in a ZIP.
3. Type the pages or the chunk size. The box under the field shows exactly what you'll get.
4. Press the button. The download starts on its own; **Download again** is there if your browser blocked it.

## Writing page ranges

The page box accepts the same style most print dialogs use. Separate items with commas, and use a hyphen for a range.

| You type | You get |
|---|---|
| 1-3, 5 | pages 1, 2, 3 and 5 |
| 8- | page 8 to the last page |
| -4 | pages 1 to 4 |
| 10-7 | pages 10, 9, 8, 7 in that order |
| 2, 1 | page 2 first, then page 1 |

In Extract mode the order you type is the order in the new file, so it doubles as a way to rearrange pages. A page listed twice is included once. A page number past the end gives an error instead of being quietly skipped.

Page numbers here mean the physical position in the file, starting at 1. That is not always the number printed on the page. A book PDF might have ten pages of front matter before "page 1", so check the page counter in your PDF reader if the numbers don't match.

## Which mode to pick

For a few pages, use Extract. To drop a blank page or a cover, Remove is quicker.

Split every page suits scanned receipts or ID cards where each page is its own document. A 200 page file gives 200 small PDFs, fine inside a ZIP but tedious to handle one by one. Chunks help when a portal only accepts files of, say, 10 pages or fewer. The preview line shows where each file starts and ends.

## Locked files and other limits

If a PDF is password protected or has copy restrictions, the tool stops and tells you, because the pages would come out blank. Open the file with its password in any PDF reader, choose Print, then "Save as PDF", and split that copy.

Pages are copied, not re-rendered, so quality stays the same. Bookmarks may not carry over, and a digital signature is no longer valid on the split file.

## FAQ

### Is it free, and is my PDF uploaded?
Yes, it is free, and no, nothing is uploaded. The splitting runs in your browser on your own device.

### How do I open the ZIP file on my phone?
On Android, the Files app opens ZIP files with a tap and lets you extract them. On iPhone, tapping a ZIP in the Files app unpacks it into a folder next to it.

### Can I split a PDF into separate pages without a ZIP?
If the file has only one chunk or one page, you get a plain PDF. For many files a ZIP is used because most browsers block a burst of separate downloads.

### Why does it say a page does not exist?
You typed a number higher than the page count shown under the file name. Check the count, and remember the numbers mean position in the file, not the number printed on the page.
