import React, { useEffect, useState } from "react";
import { Button } from "./Button";
import axios from "axios";
import { Article } from "../types/article";
import { delay } from "../helpers/delay";
import { ArticleForm } from "./ArticleForm";
import "../styles/components/articles-list.scss";
import { Link } from "react-router-dom";
import { fetchApi } from "./FetchOptions";

// Pieprasījums uz serveri
// piehglabajam datus iekš state
// renderējam datus no state

const API_URL = "http://localhost:3004/articles";

export const ArticlesList = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewArticle, setIsNewArticle] = useState(false);
  const [editedArticle, setEditedArticle] = useState<null | Article>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // useEffect(() => {
    // GET
    // POST
    // DELETE
    // PUT

    // const fetchData = () => {
    //   fetch(API_URL, {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((articles) => {
    //       setArticles(articles);
    //     })
    //     .catch((error) => {
    //       console.log(error);
    //     });
    // };

    // fetchData();
    useEffect(() => {
      const getArticles = async () => {
        try {
          setIsLoading(true);
          const articles = await fetchApi(API_URL, "GET");
          setArticles(articles);
          setIsLoading(false);
        } catch (error) {
          setIsLoading(false);
          console.log("error", error);
        }
      };
    
      getArticles();
    }, []);
    

  const addNewArticle = async (article: Article) => {
    const newArticle = {
      ...article,
    };

    try {
      // post pieprasijums
      setIsLoading(true);
      await delay(1000);
      const { data } = await axios.post(API_URL, newArticle);
      console.log("data", data);

      setArticles([...articles, data]);
      setIsLoading(false);
      setIsNewArticle(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };

  const deleteArticle = async (id?: string) => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      await delay(1000);
      await axios.delete(`${API_URL}/${id}`);
      const newArticles = articles.filter((article) => article.id !== id);
      setArticles(newArticles);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error", error);
    }
  };

  const filteredArticles = selectedCategory
    ? articles.filter((article) => article.category === selectedCategory)
    : articles;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {["Category 1", "Category 2", "Category 3", "Category 4"].map(
          (category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "active_cat" : "primary"}
              onButtonClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          )
        )}
        <Button variant={selectedCategory === null ? "active_cat" : "primary"}
        onButtonClick={() => setSelectedCategory(null)}>
          Show All
        </Button>
      </div>
      <ul className="article-list">
        {filteredArticles.length > 0
          ? filteredArticles.map((article) => {
              return (
                <li key={article.id}>
                  <article className="article-card">
                    <h3>{article.title}</h3>

                    <Button
                      onButtonClick={() => {
                        deleteArticle(article.id);
                      }}
                    >
                      Delete
                    </Button>

                    <Button
                      onButtonClick={() => {
                        setEditedArticle(article);
                      }}
                    >
                      Edit Article
                    </Button>

                    <Link to={`/articles/${article.id}`}>Go to article</Link>
                  </article>
                </li>
              );
            })
          : null}
      </ul>
      {!isNewArticle && (
        <Button
          onButtonClick={() => {
            setIsNewArticle(true);
          }}
        >
          Add new Article
        </Button>
      )}

      {isNewArticle && (
        <ArticleForm
          onCancel={() => {
            setIsNewArticle(false);
          }}
          onSubmit={(body) => {
            addNewArticle(body);
          }}
        />
      )}

      {editedArticle && (
        <ArticleForm
          onCancel={() => {
            setEditedArticle(null);
          }}
          onSubmit={async (body) => {
            try {
              setIsLoading(true);
              await delay(1000);
              const { data } = await axios.put(`${API_URL}/${body.id}`, body);
              const newArticle = articles.map((article) => {
                if (article.id === data.id) {
                  return data;
                }
                return article;
              });
              setArticles(newArticle);
              setIsLoading(false);
              setEditedArticle(null);
            } catch (error) {}
          }}
          initialValues={editedArticle}
        />
      )}
    </div>
  );
};
