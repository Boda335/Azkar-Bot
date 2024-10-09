// Import necessary classes from discord.js
const { ButtonBuilder, ActionRowBuilder, ButtonStyle, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

// Import image links directly from the JSON file
const imageLinks = require('@root/src/utils/helpers/mushaf.json');

// Array to hold image categories and URLs
const categories = Object.keys(imageLinks);

/**
 * @type {import("@utils/types/baseComponent")}
 */
module.exports = {
  // Component configuration
  name: "mushaf",
  enabled: true,

  // Action to perform when the button is clicked
  async action(client, interaction, parts) {
    // Initialize page index and category index
    let pageIndex = 0;
    let categoryIndex = 0;
    let isReplied = false;
    let timeout;

    // Function to get author text based on the current category
    const getAuthorText = () => {
      return categories[categoryIndex] || "Default Category";
    };

    // Create a function to build and send the embed message with image and buttons
    const sendEmbed = async (interaction, pageIndex, categoryIndex) => {
      const category = categories[categoryIndex];
      const urls = imageLinks[category] || [];

      // Calculate the total number of pages in the current category
      const totalPages = urls.length;

      // Determine the current image URL
      const imageUrl = urls[pageIndex] || '';
      const currentPage = categories.slice(0, categoryIndex).reduce((total, cat) => total + (imageLinks[cat]?.length || 0), 0) + pageIndex + 1;
      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle(`القرآن الكريم || ${getAuthorText()}`)
        .setFooter({
          text: `الصفحة ${currentPage} من 604`, // Total pages across all categories
        })
        .setImage(imageUrl); // Use image URL from JSON

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("prev_page")
            .setEmoji("1293236629070282847")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pageIndex === 0 && categoryIndex === 0), // Disable button if on first page of first category
          new ButtonBuilder()
            .setCustomId("next_page")
            .setEmoji("1293236630894936136")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(pageIndex === totalPages - 1 && categoryIndex === categories.length - 1), // Disable button if on last page of last category
          new ButtonBuilder()
            .setCustomId("change_category")
            .setLabel("اذهب الى سورة")
            .setStyle(ButtonStyle.Primary), // New button to change category
          new ButtonBuilder()
            .setCustomId("go_to_page")
            .setLabel("اذهب إلى صفحة")
            .setStyle(ButtonStyle.Danger) // New button to go to specific page
        );

      // Edit the existing message with the updated embed and buttons
      if (isReplied) {
        await interaction.update({
          embeds: [embed],
          components: [row],
        });
      } else {
        await interaction.reply({
          embeds: [embed],
          components: [row],
          ephemeral: true // Ensure the message is ephemeral
        });
        isReplied = true;
      }

      // Reset timeout for disabling buttons
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(async () => {
        await interaction.editReply({
          components: [
            new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId("prev_page")
                  .setEmoji("1293236629070282847")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("next_page")
                  .setEmoji("1293236630894936136")
                  .setStyle(ButtonStyle.Secondary)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("change_category")
                  .setLabel("اذهب الى سورة")
                  .setStyle(ButtonStyle.Primary)
                  .setDisabled(true),
                new ButtonBuilder()
                  .setCustomId("go_to_page")
                  .setLabel("اذهب إلى صفحة")
                  .setStyle(ButtonStyle.Danger)
                  .setDisabled(true)
              )
          ]
        });
      }, 120000); // 2 minutes
    };

    // Reply with the initial embed message
    await sendEmbed(interaction, pageIndex, categoryIndex);

    // Create a collector to handle button interactions
    const filter = i => ['prev_page', 'next_page', 'change_category', 'go_to_page'].includes(i.customId) && i.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({ filter, time: 120000 }); // 2 minutes

    collector.on('collect', async i => {
      const category = categories[categoryIndex];
      const urls = imageLinks[category] || [];
      const totalPages = urls.length;

      if (i.customId === 'prev_page') {
        if (pageIndex > 0) {
          pageIndex--;
        } else if (categoryIndex > 0) {
          categoryIndex--;
          pageIndex = (imageLinks[categories[categoryIndex]] || []).length - 1; // Go to last page of the previous category
        }
        await sendEmbed(i, pageIndex, categoryIndex);
      } else if (i.customId === 'next_page') {
        if (pageIndex < totalPages - 1) {
          pageIndex++;
        } else if (categoryIndex < categories.length - 1) {
          categoryIndex++;
          pageIndex = 0; // Go to the first page of the next category
        }
        await sendEmbed(i, pageIndex, categoryIndex);
      } else if (i.customId === 'change_category') {
        // Create and show the modal for changing category
        const modal = new ModalBuilder()
          .setCustomId('category_modal')
          .setTitle('تغير السورة');
        
        const categoryInput = new TextInputBuilder()
          .setCustomId('category_input')
          .setLabel('اكتب اسم السورة:')
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(categoryInput);
        modal.addComponents(row);
        
        await i.showModal(modal);
      } else if (i.customId === 'go_to_page') {
        // Create and show the modal for going to specific page
        const modal = new ModalBuilder()
          .setCustomId('page_modal')
          .setTitle('اذهب إلى صفحة');
        
        const pageInput = new TextInputBuilder()
          .setCustomId('page_input')
          .setLabel('اكتب رقم الصفحة من 1 إلى 604:')
          .setStyle(TextInputStyle.Short);

        const row = new ActionRowBuilder().addComponents(pageInput);
        modal.addComponents(row);
        
        await i.showModal(modal);
      }
    });

    // Handle modal submissions
    client.on('interactionCreate', async modalInteraction => {
      if (!modalInteraction.isModalSubmit()) return;

      if (modalInteraction.customId === 'category_modal') {
        const categoryName = modalInteraction.fields.getTextInputValue('category_input');
        const newCategoryIndex = categories.indexOf(categoryName);

        if (newCategoryIndex !== -1) {
          categoryIndex = newCategoryIndex;
          pageIndex = 0; // Reset to the first page of the new category
          await sendEmbed(modalInteraction, pageIndex, categoryIndex);
        } else {
          await modalInteraction.reply({ content: '**Surah not found | لم يتم العثور على السورة **', ephemeral: true });
        }
      } else if (modalInteraction.customId === 'page_modal') {
        const pageNumber = parseInt(modalInteraction.fields.getTextInputValue('page_input'));

        if (pageNumber >= 1 && pageNumber <= 604) {
          const totalImages = categories.reduce((total, cat) => total + (imageLinks[cat]?.length || 0), 0);
          
          if (pageNumber <= totalImages) {
            let currentPage = pageNumber - 1;
            categoryIndex = categories.findIndex((cat) => {
              const imagesCount = imageLinks[cat]?.length || 0;
              if (currentPage < imagesCount) return true;
              currentPage -= imagesCount;
              return false;
            });
            pageIndex = currentPage; // Set the page index for the selected category
            await sendEmbed(modalInteraction, pageIndex, categoryIndex);
          } else {
            await modalInteraction.reply({ content: '❌**Invalid page number | رقم الصفحة غير صالح**', ephemeral: true });
          }
        } else {
          await modalInteraction.reply({ content: '⚠️**Please enter a valid number between 1 and 604 | يرجى إدخال رقم صحيح بين 1 و 604**', ephemeral: true });
        }
      }
    });

    collector.on('end', async () => {
      await interaction.editReply({
        components: [
          new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId("prev_page")
                .setEmoji("1293236629070282847")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("next_page")
                .setEmoji("1293236630894936136")
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("change_category")
                .setLabel("اذهب الى سورة")
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true),
              new ButtonBuilder()
                .setCustomId("go_to_page")
                .setLabel("اذهب إلى صفحة")
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
            )
        ]
      });
    });
  }
};
